import api from "../api/axios";

export async function createOrder(phone: string) {
  const response = await api.post("/payment/create_order", { phone });
  return response.data;
}

export async function getPaymentStatus(orderId: string) {
  const response = await api.get(
    `/payment/status/${encodeURIComponent(orderId)}`,
  );

  return response.data;
}
