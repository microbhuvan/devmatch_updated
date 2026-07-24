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
exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
const message_service_1 = require("../services/message.service");
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = yield (0, message_service_1.createMessage)(req.params.conversationId, req.user.id, req.body.content);
            return res.status(201).json({
                message: "Message sent successfully",
                data: message,
            });
        }
        catch (err) {
            if (err.message === "Conversation not found") {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err.message === "Unauthorized") {
                return res.status(403).json({
                    message: "You are not a participant in this conversation",
                });
            }
            console.error(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    });
}
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Math.min(Number(req.query.limit) || 20, 100);
            const messages = yield (0, message_service_1.getConversationMessages)(req.params.conversationId, req.user.id, page, limit);
            return res.status(200).json({
                page,
                limit,
                count: messages.length,
                messages,
            });
        }
        catch (err) {
            if (err.message === "Conversation not found") {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err.message === "Unauthorized") {
                return res.status(403).json({
                    message: "You are not a participant in this conversation",
                });
            }
            console.error(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    });
}
