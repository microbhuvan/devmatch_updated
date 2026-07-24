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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveGroupConversation = exports.createGroupConversation = void 0;
const mongoose_1 = require("mongoose");
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const ConnectionRequest_model_1 = __importDefault(require("../models/ConnectionRequest.model"));
const chat_socket_1 = require("../socket/chat.socket");
const createGroupConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName, participantIds } = req.body;
        const currentUserId = req.user.id;
        const io = req.io;
        if (typeof groupName !== "string" || !groupName.trim()) {
            return res.status(400).json({ message: "Group name is required" });
        }
        if (!Array.isArray(participantIds)) {
            return res
                .status(400)
                .json({ message: "Select at least 2 participants" });
        }
        const selectedParticipants = [...new Set(participantIds)].filter((participantId) => participantId !== currentUserId);
        if (selectedParticipants.length < 2 ||
            selectedParticipants.some((participantId) => typeof participantId !== "string" ||
                !mongoose_1.Types.ObjectId.isValid(participantId))) {
            return res
                .status(400)
                .json({ message: "Select at least 2 valid participants" });
        }
        const connections = yield ConnectionRequest_model_1.default.find({
            status: "accepted",
            $or: selectedParticipants.flatMap((participantId) => [
                { fromUserId: currentUserId, toUserId: participantId },
                { fromUserId: participantId, toUserId: currentUserId },
            ]),
        }).select("fromUserId toUserId");
        const connectedUserIds = new Set(connections.map((connection) => connection.fromUserId.toString() === currentUserId
            ? connection.toUserId.toString()
            : connection.fromUserId.toString()));
        if (selectedParticipants.some((participantId) => !connectedUserIds.has(participantId))) {
            return res
                .status(403)
                .json({ message: "Groups can only include your connections" });
        }
        const conversation = yield Conversation_model_1.default.create({
            participants: [currentUserId, ...selectedParticipants],
            isGroup: true,
            groupName: groupName.trim(),
        });
        const populatedConversation = yield Conversation_model_1.default.findById(conversation._id).populate("participants", "username profile");
        // Emit event to all participants
        if (populatedConversation) {
            populatedConversation.participants.forEach((participant) => {
                const participantId = participant._id.toString();
                io.to((0, chat_socket_1.userRoom)(participantId)).emit("new_conversation", populatedConversation.toObject());
            });
        }
        return res.status(201).json({
            message: "Group created successfully",
            conversation: populatedConversation,
        });
    }
    catch (_a) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createGroupConversation = createGroupConversation;
const leaveGroupConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const currentUserId = req.user.id;
        if (!mongoose_1.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({ message: "Invalid conversation ID" });
        }
        const conversation = yield Conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (!conversation.isGroup) {
            return res.status(400).json({ message: "Not a group conversation" });
        }
        const isParticipant = conversation.participants.some((participant) => participant.toString() === currentUserId);
        if (!isParticipant) {
            return res
                .status(403)
                .json({ message: "You are not a participant in this group" });
        }
        conversation.participants = conversation.participants.filter((participant) => participant.toString() !== currentUserId);
        if (conversation.participants.length < 2) {
            yield conversation.deleteOne();
            return res.status(200).json({ message: "Group deleted" });
        }
        yield conversation.save();
        return res.status(200).json({ message: "Left group successfully" });
    }
    catch (_a) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.leaveGroupConversation = leaveGroupConversation;
