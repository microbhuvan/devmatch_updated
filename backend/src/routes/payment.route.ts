import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createOrder,
  cashfreeWebhook,
  getPaymentStatus,
} from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create_order", authMiddleware, createOrder);
paymentRouter.post("/webhook", cashfreeWebhook);
paymentRouter.get("/status/:orderId", authMiddleware, getPaymentStatus);

export default paymentRouter;
