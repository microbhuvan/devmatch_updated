import { Request, Response } from "express";
import Conversation from "../models/Conversation.model";
import ConnectionRequest from "../models/ConnectionRequest.model";

export interface UserParams {
  [key: string]: string;
  userId: string;
}

export async function getOrCreateConversation(
  req: Request<UserParams>,
  res: Response,
) {
  try {
    const currentUserId = req.user!.id;
    const otherUserId = req.params.userId;

    if (currentUserId === otherUserId) {
      return res.status(400).json({
        message: "Cannot create conversation with yourself",
      });
    }

    const connection = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: currentUserId,
          toUserId: otherUserId,
        },
        {
          fromUserId: otherUserId,
          toUserId: currentUserId,
        },
      ],
      status: "accepted",
    });

    if (!connection) {
      return res.status(403).json({
        message: "You can only chat with your connection",
      });
    }

    const conversation = await Conversation.findOne({
      isGroup: false,
      participants: {
        $all: [currentUserId, otherUserId],
      },
    });

    if (conversation) {
      return res.status(200).json({
        message: "Conversation found",
        conversation,
      });
    }

    const newConversation = await Conversation.create({
      participants: [currentUserId, otherUserId],
    });

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getConversations(req: Request, res: Response) {
  try {
    const conversations = await Conversation.find({
      participants: req.user!.id,
    })
      .populate("participants", "username profile")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "username",
        },
      })
      .sort({
        lastMessageAt: -1,
      });

    return res.status(200).json({
      conversations,
    });
  } catch (err) {
    console.error("get conversation error", err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}
