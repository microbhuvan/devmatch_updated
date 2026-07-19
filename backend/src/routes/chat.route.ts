import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getOrCreateConversation,
  getConversations,
  type UserParams,
} from "../controllers/chat.controller";
import {
  createGroupConversation,
  leaveGroupConversation,
  type LeaveGroupParams,
} from "../controllers/group.controller";
import {
  getMessages,
  sendMessage,
  type ConversationParams,
} from "../controllers/message.controller";
import { apiLimiter } from "../middlewares/rateLimiter";

const chatRouter = Router();
chatRouter.use(apiLimiter);

chatRouter.post<UserParams>(
  "/conversation/:userId",
  authMiddleware,
  getOrCreateConversation,
);
chatRouter.get<ConversationParams>(
  "/messages/:conversationId",
  authMiddleware,
  getMessages,
);
chatRouter.post<ConversationParams>(
  "/messages/:conversationId",
  authMiddleware,
  sendMessage,
);
chatRouter.get("/conversations", authMiddleware, getConversations);
chatRouter.post("/groups", authMiddleware, createGroupConversation);
chatRouter.post<LeaveGroupParams>(
  "/groups/:conversationId/leave",
  authMiddleware,
  leaveGroupConversation,
);

export default chatRouter;
