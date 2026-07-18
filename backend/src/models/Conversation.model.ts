import { Schema, model, Types } from "mongoose";
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      validate: {
        validator(value: Types.ObjectId[]) {
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
    },

    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ participants: 1 });

conversationSchema.index({ lastMessageAt: -1 });

export default model("Conversation", conversationSchema);
