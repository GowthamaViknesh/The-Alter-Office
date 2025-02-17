import { Router } from "express";
import { createUrlLimiter, isAuthincatedToken } from "../middlewares/auth.middleware.js";

import { createShortenUrlController, redirectOriginalUrlController, getAllUrlsController, deleteUrlController } from "../controllers/url.controller.js";

import requestInfoMiddleware from "../utils/supporter.js"

const urlRouter = Router();

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: Create a shortened URL for a given long URL.
 *     tags:
 *       - URL Shortening
 *     parameters:
 *       - in: body
 *         name: body
 *         description: URL data to shorten.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             longUrl:
 *               type: string
 *               description: The original long URL to shorten.
 *               example: "https://example.com/very-long-url"
 *             customAlias:
 *               type: string
 *               description: Optional custom alias for the shortened URL.
 *               example: "mycustomurl"
 *             topic:
 *               type: string
 *               description: Optional topic/category of the URL.
 *               example: "tech"
 *     responses:
 *       201:
 *         description: Shortened URL successfully created.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Shortened URL created successfully!"
 *             data:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                   example: "https://short.ly/abc123"
 *                 longUrl:
 *                   type: string
 *                   description: The original long URL.
 *                   example: "https://example.com/very-long-url"
 *                 createdAt:
 *                   type: string
 *                   description: Date when the shortened URL was created.
 *                   example: "2025-02-16T00:00:00Z"
 *       400:
 *         description: Invalid input or missing user ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /shorten/url:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirect the user to the original URL from the shortened URL alias.
 *     tags:
 *       - URL Shortening
 *     parameters:
 *       - in: query
 *         name: alias
 *         required: true
 *         type: string
 *         description: The alias of the shortened URL.
 *         example: "abc123"
 *     responses:
 *       302:
 *         description: Redirects to the original long URL.
 *       400:
 *         description: Invalid alias.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error.
 */

urlRouter.post("/shorten", createUrlLimiter, isAuthincatedToken, createShortenUrlController);
urlRouter.get("/getUrls", isAuthincatedToken, getAllUrlsController)
urlRouter.get("/shorten/:alias", requestInfoMiddleware, redirectOriginalUrlController);
urlRouter.delete("/url/:id", isAuthincatedToken, deleteUrlController)

export default urlRouter;