import express from "express";
const authRouter = express.Router();

authRouter.post("/signup", signup);

export default authRouter;