import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true,
    },
    topic: {
        type: String,
        default: null,
    },
    userId: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ShortUrl = mongoose.model("ShortUrl", urlSchema);

export default ShortUrl;