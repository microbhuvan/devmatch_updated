import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    },

    userAgent: {
        type: String,
        default: ""
    },

    ipAddress: {
        type: String,
        default: ""
    },

    expiresAt: {
        type: Date,
        required: true
    },
}, 
{timestamps: true});

const Session = mongoose.model("Session", sessionSchema);
export default Session;