import { default as rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

export const isAuthincatedToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const createUrlLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 7,
    message:
        "Too many URLs created from this IP, please try again after 15 minutes",
});
