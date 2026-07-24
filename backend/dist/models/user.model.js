"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("invalid email");
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
userSchema.virtual("session", {
    ref: "Session",
    localField: "_id",
    foreignField: "userId",
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
