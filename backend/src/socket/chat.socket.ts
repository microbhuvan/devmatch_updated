import { Types } from "mongoose";
import { verifyConversationMember } from "../services/conversation.service";
import { createMessage, markConversationMessagesAsRead } from "../services/message.service";
import { AppServer, AppSocket, ConversationPayload } from "../types/socket";

function conversationRoom(conversationId: string) {
  return `conversation:${conversationId}`;
}

async function verifyRoomAccess(payload: ConversationPayload, userId: string) {
  if (!Types.ObjectId.isValid(payload.conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  await verifyConversationMember(payload.conversationId, userId);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to complete request";
}

export function registerChatEvents(io: AppServer, socket: AppSocket) {
  const userId = socket.data.user.id;

  socket.on("join_conversation", async (payload, acknowledgement) => {
    try {
      await verifyRoomAccess(payload, userId);
      await socket.join(conversationRoom(payload.conversationId));
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });

  socket.on("send_message", async ({ conversationId, content }, acknowledgement) => {
    try {
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("Message content is required");
      }

      const message = await createMessage(conversationId, userId, content);
      io.to(conversationRoom(conversationId)).emit("receive_message", message.toObject());
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });

  socket.on("typing_start", async (payload, acknowledgement) => {
    try {
      await verifyRoomAccess(payload, userId);
      socket.to(conversationRoom(payload.conversationId)).emit("user_typing", {
        conversationId: payload.conversationId,
        userId,
      });
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });

  socket.on("typing_stop", async (payload, acknowledgement) => {
    try {
      await verifyRoomAccess(payload, userId);
      socket.to(conversationRoom(payload.conversationId)).emit("user_stopped_typing", {
        conversationId: payload.conversationId,
        userId,
      });
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });

  socket.on("mark_messages_read", async (payload, acknowledgement) => {
    try {
      await markConversationMessagesAsRead(payload.conversationId, userId);
      io.to(conversationRoom(payload.conversationId)).emit("messages_read", {
        conversationId: payload.conversationId,
        userId,
      });
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });
}
