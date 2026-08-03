import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";

type Id = string | Types.ObjectId;

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface SocketData {
  user: CustomJwtPayload;
}

/* ---------- Shared Models ---------- */

export interface UserSummary {
  _id: Id;
  username: string;
  profile?: string;
}

export interface Message {
  _id: Id;
  conversationId: Id;
  senderId: UserSummary | Id;
  messageType: "text" | "image" | "file";
  content: string;
  fileUrl?: string | null;
  fileName?: string | null;
  isDeleted: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Conversation {
  _id: Id;
  participants: (UserSummary | Id)[];
  isGroup: boolean;
  groupName?: string | null;
  lastMessage?: Message | Id | null;
  lastMessageAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/* ---------- Payloads ---------- */

export interface ConversationPayload {
  conversationId: string;
}

export interface SendMessagePayload extends ConversationPayload {
  content: string;
}

export interface SocketAcknowledgement {
  success: boolean;
  message?: unknown;
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
}

// Client -> Server

export interface ClientToServerEvents {
  join_conversation: (
    payload: ConversationPayload,
    acknowledgement?: (result: SocketAcknowledgement) => void,
  ) => void;

  send_message: (
    payload: SendMessagePayload,
    acknowledgement?: (result: SocketAcknowledgement) => void,
  ) => void;

  typing_start: (
    payload: ConversationPayload,
    acknowledgement?: (result: SocketAcknowledgement) => void,
  ) => void;

  typing_stop: (
    payload: ConversationPayload,
    acknowledgement?: (result: SocketAcknowledgement) => void,
  ) => void;
}

/* ---------- Server -> Client ---------- */

export interface ServerToClientEvents {
  receive_message: (message: Message) => void;

  update_conversation: (conversation: Conversation) => void;

  new_conversation: (conversation: Conversation) => void;

  user_typing: (payload: TypingPayload) => void;

  user_stopped_typing: (payload: TypingPayload) => void;
}

export interface InterServerEvents {}

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
