import { nanoid } from "nanoid";
import ShortUrl from "../models/url.model.js";

const BaseUrl = process.env.BASEURL;

async function generateUniqueAlias() {
    let alias;
    let exists;

    do {
        alias = nanoid(6);
        const existingUrl = await ShortUrl.findOne({ customAlias: alias });
        exists = !!existingUrl;
    } while (exists);

    return alias;
}

export const createShortenUrl = async (data) => {
    try {
        const { longUrl, customAlias, topic, userId } = data;

        let validateUrl;
        try {
            validateUrl = new URL(longUrl);
        } catch (e) {
            return { message: "Invalid URL format" };
        }

        const existingUrl = await ShortUrl.findOne({
            longUrl: validateUrl.toString(),
        });
        if (existingUrl) {
            return { message: "URL already exists" };
        }

        const urlCode = customAlias || (await generateUniqueAlias());
        const shortUrl = `${BaseUrl}/${urlCode}`;

        const url = new ShortUrl({
            longUrl: validateUrl.toString(),
            shortUrl,
            customAlias: urlCode,
            topic,
            userId,
        });

        await url.save();

        return url;
    } catch (error) {
        console.error("Error in createShortenUrl service:", error);
        throw new Error("Error creating shortened URL");
    }
};

export const getAllUrls = async (userId) => {
    const data = await ShortUrl.find({ userId: userId });
    return data;
};

export const getUrlDetailsById = async (alias) => {
    if (alias) {
        return await ShortUrl.findOne({ customAlias: alias });
    }
    return null;
};

export const deleteUrl = async (data) => {
    try {
        const existing = await ShortUrl.findOne({
            _id: data.id,
            userId: data.userId,
        });

        if (!existing) {
            return "No data found";
        }

        await ShortUrl.deleteOne({ shortUrl: existing.shortUrl });

        await ShortUrl.deleteOne({ _id: data.id, userId: data.userId });

        return existing;
    } catch (error) {
        console.error("Error in deleteUrl:", error);
        throw new Error("Error deleting URL");
    }
};

export const updateClickCount = async (alias) => {
    try {
        const updatedUrl = await ShortUrl.findOneAndUpdate(
            { customAlias: alias },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (updatedUrl) {
            console.log(`Database updated: ${updatedUrl.shortUrl} has ${updatedUrl.clicks} clicks.`);
        } else {
            console.error("URL not found in database");
        }
    } catch (err) {
        console.error("Error updating click count in database:", err);
    }
};

export const redirectOriginalUrl = async (alias) => {
    try {
        const urlRecord = await ShortUrl.findOne({ customAlias: alias });

        if (!urlRecord) {
            return null;
        }

        return { longUrl: urlRecord.longUrl };
    } catch (error) {
        console.error("Error in redirectOriginalUrl service:", error);
        throw new Error("Error redirecting URL");
    }
};