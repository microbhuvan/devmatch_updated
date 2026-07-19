import api from "../api/axios";
import type { Message } from "../types/chat.types";

export const createConversation = async (userId: string) => {
  const response = await api.post(`/chat/conversation/${userId}`);
  return response.data.conversation;
};

export const getMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const response = await api.get(`/chat/messages/${conversationId}`);
  return response.data.messages;
};

export const sendMessage = async (
  conversationId: string,
  content: string,
): Promise<Message> => {
  const response = await api.post(`/chat/messages/${conversationId}`, {
    content,
  });

  return response.data.message;
};

export const getConversations = async () => {
  const response = await api.get("/chat/conversations");

  return response.data.conversations;
};

export const createGroupConversation = async (
  groupName: string,
  participantIds: string[],
) => {
  const response = await api.post("/chat/groups", {
    groupName,
    participantIds,
  });

  return response.data.conversation;
};

export async function leaveGroupConversation(conversationId: string) {
  const response = await api.post(`/chat/groups/${conversationId}/leave`);

  return response.data;
}
