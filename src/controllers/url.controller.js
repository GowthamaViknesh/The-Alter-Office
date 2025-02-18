import joi from "joi";
import { createShortenUrl, redirectOriginalUrl, updateClickCount, getAllUrls, deleteUrl, getUrlDetailsById } from "../services/url.service.js";
import redisClient from "../config/redis.config.js";
import { trackAnalytics } from "../services/analytics.service.js";

export const createShortenUrlController = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const schema = joi.object({
            longUrl: joi.string().uri().required(),
            customAlias: joi.string().optional().allow(""),
            topic: joi.string().optional().allow(""),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const outputData = await createShortenUrl({ ...value, userId });
        if (outputData.message) {
            return res.status(400).json({ message: outputData.message });
        }

        return res.status(201).json({
            message: "Shortened URL created successfully!",
            data: {
                shortUrl: outputData.shortUrl,
                longUrl: outputData.longUrl,
                createdAt: outputData.createdAt,
            },
        });
    } catch (error) {
        console.error("Error in createShortenUrlController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUrlsController = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const data = await getAllUrls(userId);

        return res.status(200).json({ data });
    } catch (error) {
        console.error("Error in getAllUrls:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUrlDetailsByIdController = async (req, res) => {
    try {
        const { alias } = req.params;
        const data = await getUrlDetailsById({ alias });

        if (!data) {
            return res.status(404).json({ message: "URL details not found" });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in getUrlDetailsByIdController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUrlController = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const schema = joi.object({
            id: joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        value.userId = userId;

        const data = await deleteUrl(value);

        if (data === "No data found") {
            return res
                .status(404)
                .json({ message: "URL not found or already deleted" });
        }

        return res.status(200).json({ message: "Deleted successfully", data });
    } catch (error) {
        console.error("Error in deleteUrlController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const trackClick = async (shortUrl) => {
    try {
        const cacheKey = `clicks:${shortUrl}`;

        const newClickCount = await redisClient.incr(cacheKey);
        console.log(`Click count updated for ${shortUrl}: ${newClickCount}`);

        if (newClickCount % 1 === 0) {
            await updateClickCount(shortUrl);
            console.log(`Database updated for ${shortUrl}.`);
        }
    } catch (err) {
        console.error("Error incrementing click count:", err);
    }
};

export const redirectOriginalUrlController = async (req, res) => {
    try {
        const schema = joi.object({
            alias: joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { alias } = value;
        const cacheKey = `alias:${alias}`;
        const userData = await getUrlDetailsById(alias)

        console.time("Redis Lookup Time");
        const cachedUrl = await redisClient.get(cacheKey);
        console.timeEnd("Redis Lookup Time");

        if (cachedUrl) {
            console.log("Cache hit: Redirecting to cached URL");
            console.time("Track Click Time");
            await trackClick(alias);
            await trackAnalytics(req, alias, userData.userId);
            console.timeEnd("Track Click Time");
            return res.status(200).redirect(cachedUrl);
        }

        const outputData = await redirectOriginalUrl(alias);
        if (!outputData) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        await redisClient.setEx(cacheKey, 3600, outputData.longUrl);
        console.log("Cache miss: Fetched from DB and stored in Redis");

        await trackClick(alias);
        await trackAnalytics(req, alias, userData._id);

        return res.status(200).redirect(outputData.longUrl);
    } catch (error) {
        console.error("Error in redirectOriginalUrlController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};