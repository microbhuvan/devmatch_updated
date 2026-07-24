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
exports.verifyConversationMember = verifyConversationMember;
exports.getConversationById = getConversationById;
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const AppError_1 = __importDefault(require("../utils/AppError"));
function verifyConversationMember(conversationId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversation = yield Conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            throw new AppError_1.default("Conversation not found", 404);
        }
        const isParticipant = conversation.participants.some((participant) => participant.toString() === userId);
        if (!isParticipant) {
            throw new AppError_1.default("Unauthorized", 403);
        }
        return conversation;
    });
}
function getConversationById(conversationId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Conversation_model_1.default.findById(conversationId)
            .populate({
            path: "participants",
            select: "username",
            populate: {
                path: "profile",
                select: "photoURL",
            },
        })
            .populate({
            path: "lastMessage",
            select: "content createdAt",
        })
            .sort({ lastMessageAt: -1 });
    });
}
