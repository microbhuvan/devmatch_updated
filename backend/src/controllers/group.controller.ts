import { Request, Response } from "express";
import { Types } from "mongoose";
import Conversation from "../models/Conversation.model";
import ConnectionRequest from "../models/ConnectionRequest.model";
import { AppServer } from "../types/socket";
import { userRoom } from "../socket/chat.socket";

export const createGroupConversation = async (req: Request, res: Response) => {
  try {
    const { groupName, participantIds } = req.body;
    const currentUserId = req.user!.id;
    const io = (req as any).io as AppServer;

    if (typeof groupName !== "string" || !groupName.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!Array.isArray(participantIds)) {
      return res
        .status(400)
        .json({ message: "Select at least 2 participants" });
    }

    const selectedParticipants = [...new Set(participantIds)].filter(
      (participantId) => participantId !== currentUserId,
    );

    if (
      selectedParticipants.length < 2 ||
      selectedParticipants.some(
        (participantId) =>
          typeof participantId !== "string" ||
          !Types.ObjectId.isValid(participantId),
      )
    ) {
      return res
        .status(400)
        .json({ message: "Select at least 2 valid participants" });
    }

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: selectedParticipants.flatMap((participantId) => [
        { fromUserId: currentUserId, toUserId: participantId },
        { fromUserId: participantId, toUserId: currentUserId },
      ]),
    }).select("fromUserId toUserId");

    const connectedUserIds = new Set(
      connections.map((connection) =>
        connection.fromUserId.toString() === currentUserId
          ? connection.toUserId.toString()
          : connection.fromUserId.toString(),
      ),
    );

    if (
      selectedParticipants.some(
        (participantId) => !connectedUserIds.has(participantId),
      )
    ) {
      return res
        .status(403)
        .json({ message: "Groups can only include your connections" });
    }

    const conversation = await Conversation.create({
      participants: [currentUserId, ...selectedParticipants],
      isGroup: true,
      groupName: groupName.trim(),
    });

    const populatedConversation = await Conversation.findById(
      conversation._id,
    ).populate("participants", "username profile");

    // Emit event to all participants
    if (populatedConversation) {
      populatedConversation.participants.forEach((participant) => {
        const participantId = (participant as any)._id.toString();
        io.to(userRoom(participantId)).emit(
          "new_conversation",
          populatedConversation.toObject(),
        );
      });
    }

    return res.status(201).json({
      message: "Group created successfully",
      conversation: populatedConversation,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export interface LeaveGroupParams {
  [key: string]: string;
  conversationId: string;
}

export const leaveGroupConversation = async (
  req: Request<LeaveGroupParams>,
  res: Response,
) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user!.id;

    if (!Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({ message: "Not a group conversation" });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === currentUserId,
    );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this group" });
    }

    conversation.participants = conversation.participants.filter(
      (participant) => participant.toString() !== currentUserId,
    );

    if (conversation.participants.length < 2) {
      await conversation.deleteOne();
      return res.status(200).json({ message: "Group deleted" });
    }

    await conversation.save();
    return res.status(200).json({ message: "Left group successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
