import { default as rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

export const isAuthincatedToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("⛔ No or invalid Authorization header found:", authHeader);
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded successfully:", decoded);

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const createUrlLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 7,
    message:
        "Too many URLs created from this IP, please try again after 15 minutes",
});
