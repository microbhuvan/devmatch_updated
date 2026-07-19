import api from "../api/axios";

export const getFeed = async (page = 1, limit = 10) => {
  const response = await api.get(`/feed?page=${page}&limit=${limit}`);

  return response.data;
};
