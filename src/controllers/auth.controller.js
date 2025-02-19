import passport from "passport";
import { findOrCreateUser, getUserDataById } from "../services/auth.service.js"

export const login = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = passport.authenticate("google", {
    failureRedirect: "/",
});

export const handleCallback = async (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in first.");
    }

    const payload = {
        googleId: req.user.id,
        displayName: req.user.displayName,
        emailId: req.user._json.email,
        picture: req.user._json.picture,
        verifiedEmail: req.user._json.email_verified,
    };
    const data = await findOrCreateUser(payload)
    res.redirect(`https://clickbiteshort.netlify.app/auth?token=${data.token}`);
};

export const getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in first.");
    }

    const payload = {
        googleId: req.user.id,
        displayName: req.user.displayName,
        emailId: req.user._json.email,
        picture: req.user._json.picture,
        verifiedEmail: req.user._json.email_verified,
    };

    const data = await findOrCreateUser(payload)

    return res.json(data)
};

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/");
    });
};

export const getUserDataByIdController = async (req, res) => {
    try {
        const userId = req.user.userId

        const data = await getUserDataById(userId)

        return res.status(200).send(data)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}