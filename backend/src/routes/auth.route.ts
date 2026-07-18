import express from "express";
import {
  getCurrentUser,
  logIn,
  logout,
  logoutAll,
  refresh,
  signUp,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/refresh", refresh);
authRouter.get("/me", authMiddleware, getCurrentUser);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/logoutall", authMiddleware, logoutAll);

export default authRouter;
