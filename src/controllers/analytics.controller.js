import { getAnalyticsByAlias, getAnalyticsByTopic, getOverallAnalyticsData } from "../services/analytics.service.js";

export const getUrlAnalyticsController = async (req, res) => {
    try {
        const userId = req.user.userId
        const { alias } = req.params;
        const analytics = await getAnalyticsByAlias(alias, userId);

        if (!analytics) {
            return res
                .status(404)
                .json({ message: "No analytics found for this short URL" });
        }

        return res.status(200).json(analytics);
    } catch (error) {
        console.error("Error in getUrlAnalyticsController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTopicAnalyticsController = async (req, res) => {
    try {
        const userId = req.user.userId
        const { topic } = req.query;
        const topicAnalytics = await getAnalyticsByTopic(topic, userId);

        if (!topicAnalytics) {
            return res
                .status(404)
                .json({ message: "No analytics found for this topic" });
        }

        return res.status(200).json(topicAnalytics);
    } catch (error) {
        console.error("Error in getTopicAnalyticsController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOverallAnalyticsController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const overallAnalytics = await getOverallAnalyticsData(userId);

        if (!overallAnalytics) {
            return res
                .status(404)
                .json({ message: "No analytics found for your URLs" });
        }

        return res.status(200).json(overallAnalytics);
    } catch (error) {
        console.error("Error in getOverallAnalyticsController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};