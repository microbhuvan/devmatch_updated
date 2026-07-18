import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1 });

export default model("Message", messageSchema);
