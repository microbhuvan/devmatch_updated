import Conversation from "../models/Conversation.model";
import Message from "../models/Message.model";
import { verifyConversationMember } from "./conversation.service";

export async function createMessage(
  conversationId: string,
  senderId: string,
  content: string,
) {
  const conversation = await verifyConversationMember(conversationId, senderId);

  const message = await Message.create({
    conversationId,
    senderId,
    content: content.trim(),
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  return message.populate("senderId", "username");
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  page = 1,
  limit = 20,
) {
  await verifyConversationMember(conversationId, userId);
  const skip = (page - 1) * limit;

  return Message.find({ conversationId })
    .populate("senderId", "username")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);
}
