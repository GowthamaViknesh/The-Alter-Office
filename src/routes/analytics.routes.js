import { Router } from "express";
import { isAuthincatedToken } from "../middlewares/auth.middleware.js";
import { getOverallAnalyticsController, getTopicAnalyticsController, getUrlAnalyticsController } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  # Specifies the bearer authentication format for JWT
 *   schemas:
 *     AnalyticsResponse:
 *       type: object
 *       properties:
 *         totalClicks:
 *           type: number
 *         uniqueUsers:
 *           type: number
 *         clicksByDate:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               clickCount:
 *                 type: number
 *         osType:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               osName:
 *                 type: string
 *               uniqueClicks:
 *                 type: number
 *               uniqueUsers:
 *                 type: number
 *         deviceType:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *               uniqueClicks:
 *                 type: number
 *               uniqueUsers:
 *                 type: number
 */

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Retrieve overall analytics for all short URLs created by the authenticated user
 *     description: Get the overall analytics data for all short URLs created by the authenticated user, including total clicks, unique users, and more.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []  # Requires JWT token for authentication
 *     responses:
 *       200:
 *         description: Overall analytics data for the user's short URLs.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Invalid request or missing authentication.
 *       404:
 *         description: No analytics found for the user's URLs.
 *       500:
 *         description: Internal server error.
 */
analyticsRouter.get("/overall", isAuthincatedToken, getOverallAnalyticsController);

/**
 * @swagger
 * /api/analytics/topic:
 *   get:
 *     summary: Retrieve analytics for a specific topic
 *     description: Get performance analytics for all short URLs grouped under a specific topic.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []  # Requires JWT token for authentication
 *     parameters:
 *       - in: query
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic name.
 *     responses:
 *       200:
 *         description: Analytics data for the specified topic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Invalid topic parameter.
 *       404:
 *         description: No analytics found for the provided topic.
 *       500:
 *         description: Internal server error.
 */
analyticsRouter.get("/topic", isAuthincatedToken, getTopicAnalyticsController);

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Retrieve analytics for a specific short URL alias
 *     description: Get the performance analytics for a short URL based on its alias.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []  # Requires JWT token for authentication
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the short URL.
 *     responses:
 *       200:
 *         description: Analytics data for the specified short URL alias.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Invalid alias parameter.
 *       404:
 *         description: No analytics found for the provided alias.
 *       500:
 *         description: Internal server error.
 */
analyticsRouter.get("/:alias", isAuthincatedToken, getUrlAnalyticsController);

export default analyticsRouter;
