import { Router } from "express";
import { createUrlLimiter, isAuthincatedToken } from "../middlewares/auth.middleware.js";
import { createShortenUrlController, redirectOriginalUrlController, getAllUrlsController, deleteUrlController } from "../controllers/url.controller.js";
import requestInfoMiddleware from "../utils/supporter.js";

const urlRouter = Router();

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: Create a shortened URL for a given long URL.
 *     tags: [URL Shortening]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to shorten.
 *                 example: "https://example.com/very-long-url"
 *               customAlias:
 *                 type: string
 *                 description: Optional custom alias for the shortened URL.
 *                 example: "mycustomurl"
 *               topic:
 *                 type: string
 *                 description: Optional topic/category of the URL.
 *                 example: "tech"
 *     responses:
 *       201:
 *         description: Shortened URL successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shortened URL created successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shortUrl:
 *                       type: string
 *                       description: The generated short URL.
 *                       example: "https://short.ly/abc123"
 *                     longUrl:
 *                       type: string
 *                       description: The original long URL.
 *                       example: "https://example.com/very-long-url"
 *                     createdAt:
 *                       type: string
 *                       description: Date when the shortened URL was created.
 *                       example: "2025-02-16T00:00:00Z"
 *       400:
 *         description: Invalid input or missing user ID.
 *       500:
 *         description: Internal server error.
 */
urlRouter.post("/shorten", createUrlLimiter, isAuthincatedToken, createShortenUrlController);

/**
 * @swagger
 * /shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirect the user to the original URL from the shortened URL alias.
 *     tags: [URL Shortening]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
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
urlRouter.get("/shorten/:alias", requestInfoMiddleware, redirectOriginalUrlController);

/**
 * @swagger
 * /getUrls:
 *   get:
 *     summary: Get all shortened URLs
 *     description: Retrieves all shortened URLs created by the authenticated user.
 *     tags: [URL Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65a6f1b9e3d6c9a7b8c1d4f5"
 *                   shortUrl:
 *                     type: string
 *                     example: "https://short.ly/abc123"
 *                   longUrl:
 *                     type: string
 *                     example: "https://example.com/very-long-url"
 *                   createdAt:
 *                     type: string
 *                     example: "2025-02-16T00:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
urlRouter.get("/getUrls", isAuthincatedToken, getAllUrlsController);

/**
 * @swagger
 * /url/{id}:
 *   delete:
 *     summary: Delete a shortened URL
 *     description: Deletes a shortened URL by its ID.
 *     tags: [URL Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shortened URL to delete.
 *         example: "65a6f1b9e3d6c9a7b8c1d4f5"
 *     responses:
 *       200:
 *         description: URL successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL deleted successfully."
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal server error.
 */
urlRouter.delete("/url/:id", isAuthincatedToken, deleteUrlController);

export default urlRouter;
