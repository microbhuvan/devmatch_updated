import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

        validate(value: string){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        }
    }, 

    password: {
        type: String,
        required: true,
    }, 

    about: {
        type: String,
        maxlength: 300,
        default: ""
    },

    skills: {
        type: [String],
        default: [],
        trim: true,
        validate(value: string[]){
            if(value.length > 15){
                throw new Error("maximum 15 skills allowed");
            }
        }
    },

    age: {
        type: Number,
        min: 18
    },

    gender: {
        type: String,
        enum: ["male", "female", "others"],
        default: "other"
    },

    photoURL: {
        type: String,
        default: "",
        validate(value: string){
            if(!validator.isURL(value)){
                throw new Error("invalid photo url")
            }
        }
    },

    isPremium: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;