"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const payment_controller_1 = require("../controllers/payment.controller");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/create_order", auth_middleware_1.authMiddleware, payment_controller_1.createOrder);
paymentRouter.post("/verify_payment", auth_middleware_1.authMiddleware, payment_controller_1.verifyPayment);
exports.default = paymentRouter;
