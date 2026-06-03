import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: ""
    },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true })

export const User = mongoose.model('User', userSchema);
