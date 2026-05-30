import express from "express";
const profileRouter = express.Router();

import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";
import {
  createProfile,
  getMyProfile,
  getUserProfile,
  editProfile,
  updateProfilePhoto,
} from "../controllers/profile.controller";

profileRouter.post("/", authMiddleware, createProfile);
profileRouter.get("/me", authMiddleware, getMyProfile);
profileRouter.get("/:username", authMiddleware, getUserProfile);
profileRouter.patch("/", authMiddleware, editProfile);
profileRouter.patch(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  updateProfilePhoto,
);

export default profileRouter;
