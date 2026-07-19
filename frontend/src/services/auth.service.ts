import api from "../api/axios";

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post("/auth/logoutall");
  return response.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch("/auth/change-password", data, {
    withCredentials: true,
  });

  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) => {
  const response = await api.post("/auth/reset-password", data);

  return response.data;
};
