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
