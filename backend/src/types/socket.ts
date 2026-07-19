import type { Conversation, Message } from "../../shared/types"; // or your actual types
import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface SocketData {
  user: CustomJwtPayload;
}

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

export interface TypingPayload {
  conversationId: string;
  userId: string;
}

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
