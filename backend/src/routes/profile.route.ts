import express from "express";
const profileRouter = express.Router();

import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createProfile,
  getMyProfile,
  getUserProfile,
  editProfile,
} from "../controllers/profile.controller";

profileRouter.post("/", authMiddleware, createProfile);
profileRouter.get("/me", authMiddleware, getMyProfile);
profileRouter.get("/:username", authMiddleware, getUserProfile);
profileRouter.patch("/", authMiddleware, editProfile);

export default profileRouter;
