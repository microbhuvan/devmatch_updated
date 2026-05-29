import express from "express";
const authRouter = express.Router();

import {
  signUp,
  logIn,
  refresh,
  logout,
  logoutAll,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/refresh", authMiddleware, refresh);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/logoutall", authMiddleware, logoutAll);

export default authRouter;
