import express from "express";
const authRouter = express.Router();

import { signUp } from "../controllers/auth.controller";

authRouter.post("/signup", signUp);

export default authRouter;