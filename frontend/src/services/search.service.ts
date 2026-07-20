import axiosInstance from "../api/axios";

export const searchDevelopers = async (query: string) => {
  const { data } = await axiosInstance.get("/search", {
    params: {
      query,
    },
  });

  return data;
};
