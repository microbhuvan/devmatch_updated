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
exports.createMessage = createMessage;
exports.getConversationMessages = getConversationMessages;
const Message_model_1 = __importDefault(require("../models/Message.model"));
const conversation_service_1 = require("./conversation.service");
function createMessage(conversationId, senderId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversation = yield (0, conversation_service_1.verifyConversationMember)(conversationId, senderId);
        const message = yield Message_model_1.default.create({
            conversationId,
            senderId,
            content: content.trim(),
        });
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        yield conversation.save();
        return message.populate("senderId", "username");
    });
}
function getConversationMessages(conversationId_1, userId_1) {
    return __awaiter(this, arguments, void 0, function* (conversationId, userId, page = 1, limit = 20) {
        yield (0, conversation_service_1.verifyConversationMember)(conversationId, userId);
        const skip = (page - 1) * limit;
        return Message_model_1.default.find({ conversationId })
            .populate("senderId", "username")
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
    });
}
