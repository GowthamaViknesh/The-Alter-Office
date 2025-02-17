import { Router } from "express";
import { login, googleCallback, handleCallback, getProfile, logout, getUserDataByIdController } from "../controllers/auth.controller.js"

import { isAuthenticated, isAuthincatedToken } from "../middlewares/auth.middleware.js"

const authRoutes = Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiates Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login page.
 */
authRoutes.get("/google", login);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback route
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to profile after successful login.
 *       401:
 *         description: Unauthorized (login failed).
 */
authRoutes.get("/google/callback", googleCallback, handleCallback);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *       401:
 *         description: Unauthorized (user not logged in).
 */
authRoutes.get("/profile", isAuthenticated, getProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user and destroy the session
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to the home page after logout.
 */
authRoutes.get("/logout", logout);


authRoutes.get("/getUser", isAuthincatedToken, getUserDataByIdController)


export default authRoutes;