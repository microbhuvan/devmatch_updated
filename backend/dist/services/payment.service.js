"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const crypto_1 = __importDefault(require("crypto"));
function verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const generatedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    return generatedSignature === razorpaySignature;
}
