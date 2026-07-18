import express from "express";
import {
  acceptRequest,
  connections,
  receivedRequests,
  rejectRequest,
  sendRequest,
  sentRequests,
} from "../controllers/request.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

type UserIdParams = { userId: string };
type RequestIdParams = { requestId: string };

const requestRouter = express.Router();

requestRouter.post<UserIdParams>("/send/:userId", authMiddleware, sendRequest);
requestRouter.get("/sent", authMiddleware, sentRequests);
requestRouter.get("/received", authMiddleware, receivedRequests);
requestRouter.post<RequestIdParams>(
  "/request/review/accepted/:requestId",
  authMiddleware,
  acceptRequest,
);
requestRouter.post<RequestIdParams>(
  "/request/review/rejected/:requestId",
  authMiddleware,
  rejectRequest,
);
requestRouter.get("/connections", authMiddleware, connections);

export default requestRouter;
