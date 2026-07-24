"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const profileSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    skills: {
        type: [String],
        required: true,
        validate(value) {
            if (value.length === 0) {
                throw new Error("At least one skill is required");
            }
            if (value.length > 15) {
                throw new Error("Maximum 15 skills");
            }
        },
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
    },
    photoURL: {
        type: String,
        default: null,
        trim: true,
        validate(value) {
            if (value && !validator_1.default.isURL(value)) {
                throw new Error("invalid url");
            }
        },
    },
    photoPublicId: {
        type: String,
        default: null,
    },
    about: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    github: {
        type: String,
        default: "",
        validate(value) {
            if (value && !validator_1.default.isURL(value)) {
                throw new Error("invalid url");
            }
        },
    },
    linkedin: {
        type: String,
        default: "",
        validate(value) {
            if (value && !validator_1.default.isURL(value)) {
                throw new Error("invalid url");
            }
        },
    },
}, { timestamps: true });
const Profile = mongoose_1.default.model("Profile", profileSchema);
exports.default = Profile;
