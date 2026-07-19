import express from "express";
import {
  getCurrentUser,
  logIn,
  logout,
  logoutAll,
  refresh,
  signUp,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authLimiter, refreshLimiter } from "../middlewares/rateLimiter";

const authRouter = express.Router();
authRouter.post("/signup", authLimiter, signUp);
authRouter.post("/login", authLimiter, logIn);
authRouter.post("/refresh", refreshLimiter, refresh);

authRouter.post("/logout", logout);
authRouter.post("/logoutall", logoutAll);

authRouter.get("/me", authMiddleware, getCurrentUser);
authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/reset-password", authLimiter, resetPassword);
authRouter.patch("/change-password", authLimiter, changePassword);

export default authRouter;
