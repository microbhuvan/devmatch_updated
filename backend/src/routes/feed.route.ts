import express from "express";
const feedRouter = express.Router();
import { getFeed } from "../controllers/feed.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

feedRouter.get("/", authMiddleware, getFeed);

export default feedRouter;
