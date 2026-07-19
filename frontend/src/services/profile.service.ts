import api from "../api/axios";

export interface CreateProfileData {
  skills: string[];
  age?: number;
  gender?: string;
  about?: string;
  github?: string;
  linkedin?: string;
}

export const createProfile = async (data: CreateProfileData) => {
  const response = await api.post("/profile", data);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

export const updateProfile = async (data: Partial<CreateProfileData>) => {
  const response = await api.patch("/profile", data);
  return response.data;
};

export const updateProfilePhoto = async (file: File) => {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await api.patch("/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
