import express from "express";
const requestRouter = express.Router();
import {
  sendRequest,
  sentRequests,
  receivedRequests,
} from "../controllers/request.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

requestRouter.post("/send/:userId", authMiddleware, sendRequest);
requestRouter.get("/sent", authMiddleware, sentRequests);
requestRouter.get("/received", authMiddleware, receivedRequests);

export default requestRouter;
