import { Request, Response } from "express";
import { razorpay } from "../config/razorpay";
import Payment from "../models/Payment.model";
import crypto from "crypto";
import User from "../models/user.model";
import { verifyRazorpaySignature } from "../services/payment.service";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const amount = Number(process.env.AMOUNT!);

    const order = await razorpay.orders.create({
      amount,
      currency: process.env.CURRENCY!,
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId,
      razorpayOrderId: order.id,
      amount,
      currency: order.currency,
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Unable to create payment order",
    });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Idempotency
    if (payment.verified) {
      return res.status(200).json({
        message: "Payment already verified",
      });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "paid";
    payment.verified = true;

    await payment.save();

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
    });

    return res.status(200).json({
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Unable to verify payment",
    });
  }
}
