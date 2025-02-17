import mongoose from "mongoose";
import Analytics from "../models/analytics.model.js"

export const trackAnalytics = async (req, alias, id) => {
    try {
        const clientInfo = req.clientInfo || {};
        const userId = id;
        const { ip = "Unknown", geolocation = {}, device = {} } = clientInfo;

        let urlData = await Analytics.findOne({ customAlias: alias });

        if (!urlData) {
            console.error(`❌ Error: No URL data found for alias: ${alias}`);
            return;
        }

        let analytics = await Analytics.findOne({ shortUrl: alias });

        if (!analytics) {
            analytics = await create({
                shortUrl: alias,
                topic: urlData.topic || "Unknown",
                totalClicks: 1,
                uniqueUsers: 1,
                clicksByDate: [
                    { date: new Date().toISOString().split("T")[0], clickCount: 1 },
                ],
                osType: [
                    {
                        osName: device.os || "Unknown",
                        uniqueClicks: 1,
                        uniqueUsers: 1,
                    },
                ],
                deviceType: [
                    {
                        deviceName: device.isMobile ? "Mobile" : "Desktop",
                        uniqueClicks: 1,
                        uniqueUsers: 1,
                    },
                ],
                userId,
                ipAddresses: [ip]
            });
        } else {
            const currentDate = new Date().toISOString().split("T")[0];

            const dateEntry = analytics.clicksByDate.find(
                (entry) => entry.date === currentDate
            );
            if (dateEntry) {
                dateEntry.clickCount += 1;
            } else {
                analytics.clicksByDate.push({ date: currentDate, clickCount: 1 });
            }

            const osEntry = analytics.osType.find(
                (entry) => entry.osName === device.os
            );
            if (osEntry) {
                osEntry.uniqueClicks += 1;
            } else {
                analytics.osType.push({
                    osName: device.os || "Unknown",
                    uniqueClicks: 1,
                    uniqueUsers: 1,
                });
            }

            const deviceEntry = analytics.deviceType.find(
                (entry) => entry.deviceName === (device.isMobile ? "Mobile" : "Desktop")
            );
            if (deviceEntry) {
                deviceEntry.uniqueClicks += 1;
            } else {
                analytics.deviceType.push({
                    deviceName: device.isMobile ? "Mobile" : "Desktop",
                    uniqueClicks: 1,
                    uniqueUsers: 1,
                });
            }

            analytics.totalClicks += 1;

            if (!analytics.ipAddresses.includes(ip)) {
                analytics.uniqueUsers += 1;
                analytics.ipAddresses.push(ip);
            }

            analytics.topic = urlData.topic;
            analytics.userId = userId;

            await analytics.save();
        }
    } catch (error) {
        console.error("❌ Error tracking analytics:", error);
    }
};

export const getAnalyticsByAlias = async (alias, userId) => {
    return await Analytics.findOne({ shortUrl: alias, userId: userId });
};

export const getAnalyticsByTopic = async (topic, userId) => {
    const analytics = (await Analytics.find({ topic, userId })) || [];

    return {
        totalClicks: analytics.reduce((sum, a) => sum + (a.totalClicks || 0), 0),
        uniqueUsers: analytics.reduce((sum, a) => sum + (a.uniqueUsers || 0), 0),
        clicksByDate: analytics.flatMap((a) => a.clicksByDate || []),
        urls: analytics.map((a) => ({
            shortUrl: a.shortUrl || "",
            totalClicks: a.totalClicks || 0,
            uniqueUsers: a.uniqueUsers || 0,
        })),
    };
};

export const getOverallAnalyticsData = async (userId) => {
    if (!userId) {
        console.error("Invalid userId provided");
        return { error: "User ID is required" };
    }

    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const analytics = await Analytics.find({ userId: objectId });
        return {
            totalUrls: analytics.length,
            totalClicks: analytics.reduce((sum, a) => sum + (a.totalClicks || 0), 0),
            uniqueUsers: analytics.reduce((sum, a) => sum + (a.uniqueUsers || 0), 0),
            clicksByDate: analytics.flatMap((a) => a.clicksByDate || []),
            osType: analytics.flatMap((a) => a.osType || []),
            deviceType: analytics.flatMap((a) => a.deviceType || []),
        };
    } catch (error) {
        console.error("Error fetching overall analytics data:", error);
        return { error: "Internal server error" };
    }
};