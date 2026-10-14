import { Schema, model, Types } from "mongoose";

export interface IPayment {
  userId: Types.ObjectId;
  cashfreeOrderId: string;
  cashfreePaymentId?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  verified: boolean;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    cashfreeOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    cashfreePaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IPayment>("Payment", paymentSchema);
