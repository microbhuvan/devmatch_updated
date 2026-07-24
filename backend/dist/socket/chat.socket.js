"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoom = userRoom;
exports.registerChatEvents = registerChatEvents;
const mongoose_1 = require("mongoose");
const conversation_service_1 = require("../services/conversation.service");
const message_service_1 = require("../services/message.service");
function conversationRoom(conversationId) {
    return `conversation:${conversationId}`;
}
function userRoom(userId) {
    return `user:${userId}`;
}
function verifyRoomAccess(payload, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.Types.ObjectId.isValid(payload.conversationId)) {
            throw new Error("Invalid conversation ID");
        }
        yield (0, conversation_service_1.verifyConversationMember)(payload.conversationId, userId);
    });
}
function errorMessage(error) {
    return error instanceof Error ? error.message : "Unable to complete request";
}
function registerChatEvents(io, socket) {
    const userId = socket.data.user.id;
    socket.on("join_conversation", (payload, acknowledgement) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyRoomAccess(payload, userId);
            yield socket.join(conversationRoom(payload.conversationId));
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: true });
        }
        catch (error) {
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: false, message: errorMessage(error) });
        }
    }));
    socket.on("send_message", (_a, acknowledgement_1) => __awaiter(this, [_a, acknowledgement_1], void 0, function* ({ conversationId, content }, acknowledgement) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(conversationId)) {
                throw new Error("Invalid conversation ID");
            }
            yield (0, conversation_service_1.verifyConversationMember)(conversationId, userId);
            if (typeof content !== "string" || !content.trim()) {
                throw new Error("Message content is required");
            }
            const message = yield (0, message_service_1.createMessage)(conversationId, userId, content.trim());
            io.to(conversationRoom(conversationId)).emit("receive_message", message.toObject());
            // Get updated conversation and notify all participants
            const updatedConversation = yield (0, conversation_service_1.getConversationById)(conversationId);
            if (updatedConversation) {
                updatedConversation.participants.forEach((participant) => {
                    const participantId = participant._id.toString();
                    io.to(userRoom(participantId)).emit("update_conversation", updatedConversation.toObject());
                });
            }
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({
                success: true,
                message,
            });
        }
        catch (error) {
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({
                success: false,
                message: errorMessage(error),
            });
        }
    }));
    socket.on("typing_start", (payload, acknowledgement) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyRoomAccess(payload, userId);
            socket.to(conversationRoom(payload.conversationId)).emit("user_typing", {
                conversationId: payload.conversationId,
                userId,
            });
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: true });
        }
        catch (error) {
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: false, message: errorMessage(error) });
        }
    }));
    socket.on("typing_stop", (payload, acknowledgement) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyRoomAccess(payload, userId);
            socket
                .to(conversationRoom(payload.conversationId))
                .emit("user_stopped_typing", {
                conversationId: payload.conversationId,
                userId,
            });
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: true });
        }
        catch (error) {
            acknowledgement === null || acknowledgement === void 0 ? void 0 : acknowledgement({ success: false, message: errorMessage(error) });
        }
    }));
}
