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
exports.getOrCreateConversation = getOrCreateConversation;
exports.getConversations = getConversations;
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const ConnectionRequest_model_1 = __importDefault(require("../models/ConnectionRequest.model"));
function getOrCreateConversation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUserId = req.user.id;
            const otherUserId = req.params.userId;
            if (currentUserId === otherUserId) {
                return res.status(400).json({
                    message: "Cannot create conversation with yourself",
                });
            }
            const connection = yield ConnectionRequest_model_1.default.findOne({
                $or: [
                    {
                        fromUserId: currentUserId,
                        toUserId: otherUserId,
                    },
                    {
                        fromUserId: otherUserId,
                        toUserId: currentUserId,
                    },
                ],
                status: "accepted",
            });
            if (!connection) {
                return res.status(403).json({
                    message: "You can only chat with your connection",
                });
            }
            const conversation = yield Conversation_model_1.default.findOne({
                isGroup: false,
                participants: {
                    $all: [currentUserId, otherUserId],
                },
            });
            if (conversation) {
                return res.status(200).json({
                    message: "Conversation found",
                    conversation,
                });
            }
            const newConversation = yield Conversation_model_1.default.create({
                participants: [currentUserId, otherUserId],
            });
            return res.status(201).json({
                message: "Conversation created successfully",
                conversation: newConversation,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    });
}
function getConversations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conversations = yield Conversation_model_1.default.find({
                participants: req.user.id,
            })
                .populate("participants", "username profile")
                .populate({
                path: "lastMessage",
                populate: {
                    path: "senderId",
                    select: "username",
                },
            })
                .sort({
                lastMessageAt: -1,
            });
            return res.status(200).json({
                conversations,
            });
        }
        catch (err) {
            console.error("get conversation error", err);
            return res.status(500).json({
                message: "Server Error",
            });
        }
    });
}
