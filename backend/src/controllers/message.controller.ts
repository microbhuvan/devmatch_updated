import { Request, Response } from "express";
import {
  createMessage,
  getConversationMessages,
} from "../services/message.service";

export interface ConversationParams {
  [key: string]: string;
  conversationId: string;
}

interface SendMessageBody {
  content: string;
}

interface MessageQuery {
  page?: string;
  limit?: string;
}

export async function sendMessage(
  req: Request<ConversationParams, {}, SendMessageBody>,
  res: Response,
) {
  try {
    const message = await createMessage(
      req.params.conversationId,
      req.user!.id,
      req.body.content,
    );

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err: any) {
    if (err.message === "Conversation not found") {
      return res.status(404).json({
        message: err.message,
      });
    }

    if (err.message === "Unauthorized") {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getMessages(
  req: Request<ConversationParams, {}, {}, MessageQuery>,
  res: Response,
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const messages = await getConversationMessages(
      req.params.conversationId,
      req.user!.id,
      page,
      limit,
    );

    return res.status(200).json({
      page,
      limit,
      count: messages.length,
      messages,
    });
  } catch (err: any) {
    if (err.message === "Conversation not found") {
      return res.status(404).json({
        message: err.message,
      });
    }

    if (err.message === "Unauthorized") {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
