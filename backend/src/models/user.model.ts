import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
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


    isPremium: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});


userSchema.virtual("profile",{
    ref: "Profile",
    localField: "_id",
    foreignField: "userId",
    justOne: true
})

const User = mongoose.model("User", userSchema);
export default User;