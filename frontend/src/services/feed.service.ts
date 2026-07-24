import api from "../api/axios";
import type { FeedUser } from "../types/feed.types";

interface FeedResponse {
  users: FeedUser[];
}

export const getFeed = async (page = 1, limit = 10): Promise<FeedResponse> => {
  const response = await api.get<FeedResponse>(
    `/feed?page=${page}&limit=${limit}`,
  );

  return response.data;
};
