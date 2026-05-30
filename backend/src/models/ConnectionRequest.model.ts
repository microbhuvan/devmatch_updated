import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["interested", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index(
  {
    fromUserId: 1,
    toUserId: 1,
  },
  {
    unique: true,
  },
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
export default ConnectionRequest;
