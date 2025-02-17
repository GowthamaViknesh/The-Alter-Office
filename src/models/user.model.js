import mongoose from "mongoose";

const Userschema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
        googleId: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true,
        },
        verifiedEmail: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", Userschema);

export default User;