import { Router } from "express";
import { login, googleCallback, handleCallback, getProfile, logout, getUserDataByIdController } from "../controllers/auth.controller.js";
import { isAuthenticated, isAuthincatedToken } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: session
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  # This ensures that the Bearer prefix is added automatically
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's unique identifier
 *         emailId:
 *           type: string
 *           description: User's email address
 *         displayName:
 *           type: string
 *           description: User's display name
 *         picture:
 *           type: string
 *           description: URL to user's profile picture
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *   security:
 *     - cookieAuth: []
 *     - bearerAuth: []  # This applies the JWT Bearer authentication globally
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Profile
 *     description: User profile management endpoints
 */

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Initiates Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects the user to Google's OAuth 2.0 authentication page
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
authRoutes.get("/google", login);

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback route
 *     tags: [Authentication]
 *     description: Handles the callback from Google OAuth after successful authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       302:
 *         description: Redirects to profile page on successful authentication
 *       401:
 *         description: Unauthorized - Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.get("/google/callback", googleCallback, handleCallback);

authRoutes.get("/profile", isAuthenticated, getProfile);

/**
 * @openapi
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logs out the current user and destroys their session
 *     responses:
 *       302:
 *         description: Redirects to home page after successful logout
 */
authRoutes.get("/logout", logout);

/**
 * @openapi
 * /api/auth/getUser:
 *   get:
 *     summary: Get user data by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []  # Ensures the use of JWT Bearer authentication
 *     description: Retrieves user data using the authenticated token
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.get("/getUser", isAuthincatedToken, getUserDataByIdController);

export default authRoutes;
