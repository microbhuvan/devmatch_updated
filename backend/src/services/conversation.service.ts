import Conversation from "../models/Conversation.model";
import AppError from "../utils/AppError";

export async function verifyConversationMember(
  conversationId: string,
  userId: string,
) {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId,
  );

  if (!isParticipant) {
    throw new AppError("Unauthorized", 403);
  }

  return conversation;
}

export async function getConversationById(conversationId: string) {
  return Conversation.findById(conversationId)
    .populate({
      path: "participants",
      select: "username",
      populate: {
        path: "profile",
        select: "photoURL",
      },
    })
    .populate({
      path: "lastMessage",
      select: "content createdAt",
    })
    .sort({ lastMessageAt: -1 });
}
