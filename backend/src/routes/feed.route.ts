import express from "express";
import { apiLimiter } from "../middlewares/rateLimiter";

const feedRouter = express.Router();
feedRouter.use(apiLimiter);

import { getFeed } from "../controllers/feed.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

feedRouter.get("/", authMiddleware, getFeed);

export default feedRouter;
