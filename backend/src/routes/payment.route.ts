import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createOrder, verifyPayment } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create_order", authMiddleware, createOrder);
paymentRouter.post("/verify_payment", authMiddleware, verifyPayment);

export default paymentRouter;
