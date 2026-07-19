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
      required: true,
      validate(value: string[]) {
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
      default: "",
      validate(value: string) {
        if (value && !validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },

    linkedin: {
      type: String,
      default: "",
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
