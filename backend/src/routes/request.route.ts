import express from "express";
import {
  acceptRequest,
  connections,
  receivedRequests,
  rejectRequest,
  sendRequest,
  sentRequests,
  ignoreUser,
  cancelRequest,
  removeConnection,
  type UserIdParams,
  type RequestIdParams,
} from "../controllers/request.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter";

const requestRouter = express.Router();
requestRouter.use(apiLimiter);

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
requestRouter.post<UserIdParams>("/ignore/:userId", authMiddleware, ignoreUser);
requestRouter.delete<RequestIdParams>(
  "/cancel/:requestId",
  authMiddleware,
  cancelRequest,
);
requestRouter.delete("/connections/:userId", authMiddleware, removeConnection);

export default requestRouter;
