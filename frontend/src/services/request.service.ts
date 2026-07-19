import api from "../api/axios";

export const sendConnectionRequest = async (userId: string) => {
  const response = await api.post(`/request/send/${userId}`);
  return response.data;
};

export const getReceivedRequests = async () => {
  const response = await api.get("/request/received");
  return response.data;
};

export const acceptRequest = async (requestId: string) => {
  const response = await api.post(
    `/request/request/review/accepted/${requestId}`,
  );

  return response.data;
};

export const rejectRequest = async (requestId: string) => {
  const response = await api.post(
    `/request/request/review/rejected/${requestId}`,
  );

  return response.data;
};

export const getConnections = async () => {
  const response = await api.get("/request/connections");
  return response.data;
};

export async function ignoreUser(userId: string) {
  const response = await api.post(`/request/ignore/${userId}`);
  return response.data;
}

export async function getSentRequests() {
  const response = await api.get("/request/sent");
  return response.data;
}

export async function cancelRequest(requestId: string) {
  const response = await api.delete(`/request/cancel/${requestId}`);
  return response.data;
}

export async function getPendingRequestCount() {
  const response = await api.get("/request/received");
  return response.data.requests.length;
}
