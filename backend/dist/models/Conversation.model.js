"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    participants: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        required: true,
        validate: {
            validator(value) {
                return value.length >= 2;
            },
            message: "Conversation must have at least 2 participants",
        },
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupName: {
        type: String,
        trim: true,
        default: null,
    },
    lastMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
exports.default = mongoose_1.default.model("Conversation", conversationSchema);
