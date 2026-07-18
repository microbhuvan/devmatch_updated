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
  message?: string;
}

export interface ClientToServerEvents {
  join_conversation: (payload: ConversationPayload, acknowledgement?: (result: SocketAcknowledgement) => void) => void;
  send_message: (payload: SendMessagePayload, acknowledgement?: (result: SocketAcknowledgement) => void) => void;
  typing_start: (payload: ConversationPayload, acknowledgement?: (result: SocketAcknowledgement) => void) => void;
  typing_stop: (payload: ConversationPayload, acknowledgement?: (result: SocketAcknowledgement) => void) => void;
  mark_messages_read: (payload: ConversationPayload, acknowledgement?: (result: SocketAcknowledgement) => void) => void;
}

export interface ServerToClientEvents {
  receive_message: (message: Record<string, unknown>) => void;
  user_typing: (payload: { conversationId: string; userId: string }) => void;
  user_stopped_typing: (payload: { conversationId: string; userId: string }) => void;
  messages_read: (payload: { conversationId: string; userId: string }) => void;
  presence_changed: (payload: { userId: string; isOnline: boolean }) => void;
}

export interface InterServerEvents {}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
