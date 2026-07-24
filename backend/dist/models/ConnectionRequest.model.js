"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionRequestSchema = new mongoose_1.default.Schema({
    fromUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["interested", "accepted", "rejected", "ignored"],
        required: true,
    },
}, { timestamps: true });
connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
}, {
    unique: true,
});
const ConnectionRequest = mongoose_1.default.model("ConnectionRequest", connectionRequestSchema);
exports.default = ConnectionRequest;
