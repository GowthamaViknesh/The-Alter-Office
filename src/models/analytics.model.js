import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    topic: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    totalClicks: {
        type: Number,
        default: 0,
    },
    uniqueUsers: {
        type: Number,
        default: 0,
    },
    clicksByDate: [
        {
            date: {
                type: Date,
                required: true,
            },
            clickCount: {
                type: Number,
                required: true,
            },
        },
    ],
    osType: [
        {
            osName: {
                type: String,
                required: true,
            },
            uniqueClicks: {
                type: Number,
                default: 0,
            },
            uniqueUsers: {
                type: Number,
                default: 0,
            },
        },
    ],
    deviceType: [
        {
            deviceName: {
                type: String,
                required: true,
            },
            uniqueClicks: {
                type: Number,
                default: 0,
            },
            uniqueUsers: {
                type: Number,
                default: 0,
            },
        },
    ],
    ipAddresses: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;