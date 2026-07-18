import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getOrCreateConversation } from "../controllers/chat.controller";
import { getMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

router.post<{ userId: string }>(
  "/conversation/:userId",
  authMiddleware,
  getOrCreateConversation,
);
router.get<{ conversationId: string }>(
  "/messages/:conversationId",
  authMiddleware,
  getMessages,
);
router.post<{ conversationId: string }>(
  "/messages/:conversationId",
  authMiddleware,
  sendMessage,
);

export default router;
