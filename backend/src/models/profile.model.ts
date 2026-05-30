import mongoose from "mongoose";
import validator from "validator";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: {
      type: [String],
      default: [],
      validate(value: string[]) {
        if (value.length > 15) {
          throw new Error("maximum skills allowed is 15");
        }
      },
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    photoURL: {
      type: String,
      default: null,
      trim: true,
      validate(value: string | null) {
        if (value && !validator.isURL(value)) {
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
      default: "none",
      validate(value: string) {
        if (value && !validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },

    linkedin: {
      type: String,
      default: "none",
      validate(value: string) {
        if (value && !validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
