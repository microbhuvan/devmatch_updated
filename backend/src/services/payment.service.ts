import { cashfreeBaseUrl, getCashfreeHeaders } from "../config/cashfree";

interface CreateCashfreeOrderParams {
  orderId: string;
  amount: number;
  userId: string;
  email: string;
  phone: string;
  returnUrl: string;
  notifyUrl: string;
}

export async function createCashfreeOrder({
  orderId,
  amount,
  userId,
  email,
  phone,
  returnUrl,
  notifyUrl,
}: CreateCashfreeOrderParams) {
  const response = await fetch(`${cashfreeBaseUrl}/orders`, {
    method: "POST",
    headers: getCashfreeHeaders(),
    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",

      customer_details: {
        customer_id: userId,
        customer_email: email,
        customer_phone: phone,
      },

      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Cashfree order creation failed:", data);
    throw new Error("Unable to create Cashfree order");
  }

  return data;
}
