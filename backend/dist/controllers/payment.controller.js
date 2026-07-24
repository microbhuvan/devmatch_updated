"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.verifyPayment = verifyPayment;
const razorpay_1 = require("../config/razorpay");
const Payment_model_1 = __importDefault(require("../models/Payment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const payment_service_1 = require("../services/payment.service");
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const amount = Number(process.env.AMOUNT);
            const order = yield razorpay_1.razorpay.orders.create({
                amount,
                currency: process.env.CURRENCY,
                receipt: `receipt_${Date.now()}`,
            });
            yield Payment_model_1.default.create({
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
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Unable to create payment order",
            });
        }
    });
}
function verifyPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
            const isValid = (0, payment_service_1.verifyRazorpaySignature)(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            if (!isValid) {
                return res.status(400).json({
                    message: "Invalid payment signature",
                });
            }
            const payment = yield Payment_model_1.default.findOne({
                razorpayOrderId,
            });
            if (!payment) {
                return res.status(404).json({
                    message: "Payment not found",
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
            yield payment.save();
            yield user_model_1.default.findByIdAndUpdate(userId, {
                isPremium: true,
            });
            return res.status(200).json({
                message: "Payment verified successfully",
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Unable to verify payment",
            });
        }
    });
}
