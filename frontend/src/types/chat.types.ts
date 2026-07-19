export interface Profile {
  _id: string;
  photoURL?: string;
}

export interface ChatUser {
  _id: string;
  username: string;
  profile?: Profile;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: ChatUser;
  content: string;
  messageType: "text" | "image" | "file";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: ChatUser[];
  isGroup: boolean;
  groupName?: string;
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}
