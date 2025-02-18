import { Router } from "express";
import { isAuthincatedToken } from "../middlewares/auth.middleware.js";
import { getOverallAnalyticsController, getTopicAnalyticsController, getUrlAnalyticsController } from "../controllers/analytics.controller.js";

const analyticsRouter = Router()

/**
 * @swagger
 * /analytics/alias:
 *   get:
 *     summary: Retrieve analytics for a specific short URL alias
 *     description: Get the performance analytics for a short URL based on its alias.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: alias
 *         required: true
 *         type: string
 *         description: The alias of the short URL.
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Analytics data for the specified short URL alias.
 *         schema:
 *           type: object
 *           properties:
 *             totalClicks:
 *               type: number
 *               example: 120
 *             uniqueUsers:
 *               type: number
 *               example: 75
 *             clicksByDate:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2025-02-16"
 *                   clickCount:
 *                     type: number
 *                     example: 50
 *             osType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   osName:
 *                     type: string
 *                     example: "Windows"
 *                   uniqueClicks:
 *                     type: number
 *                     example: 30
 *                   uniqueUsers:
 *                     type: number
 *                     example: 20
 *             deviceType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deviceName:
 *                     type: string
 *                     example: "Mobile"
 *                   uniqueClicks:
 *                     type: number
 *                     example: 20
 *                   uniqueUsers:
 *                     type: number
 *                     example: 15
 *       400:
 *         description: Invalid alias parameter.
 *       404:
 *         description: No analytics found for the provided alias.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /analytics/topic:
 *   get:
 *     summary: Retrieve analytics for a specific topic
 *     description: Get performance analytics for all short URLs grouped under a specific topic.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: topic
 *         required: true
 *         type: string
 *         description: The topic name.
 *         example: "tech"
 *     responses:
 *       200:
 *         description: Analytics data for the specified topic.
 *         schema:
 *           type: object
 *           properties:
 *             totalClicks:
 *               type: number
 *               example: 500
 *             uniqueUsers:
 *               type: number
 *               example: 300
 *             clicksByDate:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2025-02-16"
 *                   clickCount:
 *                     type: number
 *                     example: 100
 *             urls:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   shortUrl:
 *                     type: string
 *                     example: "https://short.ly/abc123"
 *                   totalClicks:
 *                     type: number
 *                     example: 120
 *                   uniqueUsers:
 *                     type: number
 *                     example: 75
 *       400:
 *         description: Invalid topic parameter.
 *       404:
 *         description: No analytics found for the provided topic.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /analytics/overall:
 *   get:
 *     summary: Retrieve overall analytics for all short URLs created by the authenticated user
 *     description: Get the overall analytics data for all short URLs created by the authenticated user, including total clicks, unique users, and more.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         type: string
 *         description: The authenticated user's ID.
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Overall analytics data for the user's short URLs.
 *         schema:
 *           type: object
 *           properties:
 *             totalUrls:
 *               type: number
 *               example: 50
 *             totalClicks:
 *               type: number
 *               example: 1000
 *             uniqueUsers:
 *               type: number
 *               example: 500
 *             clicksByDate:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2025-02-16"
 *                   clickCount:
 *                     type: number
 *                     example: 150
 *             osType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   osName:
 *                     type: string
 *                     example: "Windows"
 *                   uniqueClicks:
 *                     type: number
 *                     example: 200
 *                   uniqueUsers:
 *                     type: number
 *                     example: 150
 *             deviceType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deviceName:
 *                     type: string
 *                     example: "Desktop"
 *                   uniqueClicks:
 *                     type: number
 *                     example: 100
 *                   uniqueUsers:
 *                     type: number
 *                     example: 80
 *       400:
 *         description: Invalid user ID or missing authentication.
 *       404:
 *         description: No analytics found for the user's URLs.
 *       500:
 *         description: Internal server error.
 */
analyticsRouter.get("/overall", isAuthincatedToken, getOverallAnalyticsController);
// analyticsRouter.get("/topic", isAuthincatedToken, getTopicAnalyticsController);
// analyticsRouter.get("/:alias", isAuthincatedToken, getUrlAnalyticsController);

export default analyticsRouter