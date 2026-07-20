import api from "../api/axios";

export async function createOrder() {
  const response = await api.post("/payment/create_order");

  return response.data;
}

export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const response = await api.post("/payment/verify_payment", data);

  return response.data;
}
