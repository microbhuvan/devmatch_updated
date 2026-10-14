import { Request, Response } from "express";
import User from "../models/user.model";
import Payment from "../models/Payment.model";
import { createCashfreeOrder } from "../services/payment.service";
import { verifyCashfreeWebhook } from "../config/cashfree";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const phone = String(req.body.phone || "").trim();

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isPremium) {
      return res.status(400).json({
        message: "You already have Premium",
      });
    }

    const amount = Number(process.env.AMOUNT || 10);
    const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");
    const backendUrl = process.env.BACKEND_PUBLIC_URL?.replace(/\/$/, "");

    if (!clientUrl || !backendUrl || !Number.isFinite(amount) || amount <= 0) {
      return res.status(500).json({
        message: "Payment configuration is incomplete",
      });
    }

    const orderId = `dm_${Date.now()}_${userId}`;

    const order = await createCashfreeOrder({
      orderId,
      amount,
      userId,
      email: user.email,
      phone,
      returnUrl: `${clientUrl}/upgrade?order_id={order_id}`,
      notifyUrl: `${backendUrl}/api/payment/webhook`,
    });

    await Payment.create({
      userId,
      cashfreeOrderId: order.order_id,
      amount,
      currency: "INR",
      status: "created",
      verified: false,
    });

    return res.status(201).json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Create Cashfree order error:", error);

    return res.status(500).json({
      message: "Unable to create payment order",
    });
  }
}

export async function cashfreeWebhook(req: Request, res: Response) {
  try {
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody?.toString(
      "utf8",
    );

    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (
      !rawBody ||
      typeof signature !== "string" ||
      typeof timestamp !== "string" ||
      !verifyCashfreeWebhook(signature, timestamp, rawBody)
    ) {
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(rawBody);
    const orderId = event.data?.order?.order_id;
    const paymentData = event.data?.payment;

    if (
      event.type !== "PAYMENT_SUCCESS_WEBHOOK" &&
      event.type !== "PAYMENT_FAILED_WEBHOOK"
    ) {
      return res.status(200).json({ message: "Event ignored" });
    }

    if (!orderId || !paymentData?.cf_payment_id) {
      return res.status(400).json({ message: "Invalid payment event" });
    }

    const payment = await Payment.findOne({
      cashfreeOrderId: orderId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    if (payment.status === "paid" && payment.verified) {
      return res.status(200).json({ message: "Payment already processed" });
    }

    if (event.type === "PAYMENT_FAILED_WEBHOOK") {
      payment.status = "failed";
      await payment.save();

      return res.status(200).json({ message: "Payment failure recorded" });
    }

    if (
      paymentData.payment_status !== "SUCCESS" ||
      Number(paymentData.payment_amount) !== payment.amount ||
      paymentData.payment_currency !== payment.currency
    ) {
      return res.status(400).json({
        message: "Payment status, amount, or currency mismatch",
      });
    }

    payment.cashfreePaymentId = String(paymentData.cf_payment_id);
    payment.status = "paid";
    payment.verified = true;

    await payment.save();

    await User.findByIdAndUpdate(payment.userId, {
      isPremium: true,
    });

    return res.status(200).json({
      message: "Payment verified and Premium activated",
    });
  } catch (error) {
    console.error("Cashfree webhook error:", error);

    return res.status(500).json({
      message: "Unable to process payment webhook",
    });
  }
}

export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const payment = await Payment.findOne({
      cashfreeOrderId: req.params.orderId,
      userId: req.user!.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({
      status: payment.status,
      verified: payment.verified,
    });
  } catch (error) {
    console.error("Payment status error:", error);

    return res.status(500).json({
      message: "Unable to fetch payment status",
    });
  }
}
