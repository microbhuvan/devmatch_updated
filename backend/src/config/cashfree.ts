import crypto from "crypto";

const CASHFREE_API_VERSION = "2025-01-01";

export const cashfreeBaseUrl =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export function getCashfreeHeaders() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials are missing");
  }

  return {
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
    "x-api-version": CASHFREE_API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export function verifyCashfreeWebhook(
  signature: string,
  timestamp: string,
  rawBody: string,
): boolean {
  const secret = process.env.CASHFREE_CLIENT_SECRET;

  if (!secret || !signature || !timestamp || !rawBody) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
