import { Types } from "mongoose";
import {
  getConversationById,
  verifyConversationMember,
} from "../services/conversation.service";
import { createMessage } from "../services/message.service";
import { AppServer, AppSocket, ConversationPayload } from "../types/socket";

function conversationRoom(conversationId: string) {
  return `conversation:${conversationId}`;
}

export function userRoom(userId: string) {
  return `user:${userId}`;
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

  socket.on(
    "send_message",
    async ({ conversationId, content }, acknowledgement) => {
      try {
        if (!Types.ObjectId.isValid(conversationId)) {
          throw new Error("Invalid conversation ID");
        }

        await verifyConversationMember(conversationId, userId);

        if (typeof content !== "string" || !content.trim()) {
          throw new Error("Message content is required");
        }

        const message = await createMessage(
          conversationId,
          userId,
          content.trim(),
        );

        io.to(conversationRoom(conversationId)).emit(
          "receive_message",
          message.toObject(),
        );

        // Get updated conversation and notify all participants
        const updatedConversation = await getConversationById(conversationId);
        if (updatedConversation) {
          updatedConversation.participants.forEach((participant) => {
            const participantId = participant._id.toString();
            io.to(userRoom(participantId)).emit(
              "update_conversation",
              updatedConversation.toObject(),
            );
          });
        }

        acknowledgement?.({
          success: true,
          message,
        });
      } catch (error) {
        acknowledgement?.({
          success: false,
          message: errorMessage(error),
        });
      }
    },
  );

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
      socket
        .to(conversationRoom(payload.conversationId))
        .emit("user_stopped_typing", {
          conversationId: payload.conversationId,
          userId,
        });
      acknowledgement?.({ success: true });
    } catch (error) {
      acknowledgement?.({ success: false, message: errorMessage(error) });
    }
  });
}
