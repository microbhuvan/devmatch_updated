"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text",
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    fileUrl: {
        type: String,
        default: null,
    },
    fileName: {
        type: String,
        default: null,
    },
    // readBy: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // isEdited: {
    //   type: Boolean,
    //   default: false,
    // },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1 });
exports.default = (0, mongoose_1.model)("Message", messageSchema);
