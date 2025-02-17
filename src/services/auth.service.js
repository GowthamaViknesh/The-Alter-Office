import User from '../models/user.model.js'
import jwt from "jsonwebtoken"

export const findOrCreateUser = async (input) => {
    try {
        let user = await User.findOne({ googleId: input.googleId });

        if (!user) {
            if (input.verifiedEmail) {
                const registeredUser = await User.create(input);
                const token = jwt.sign({ userId: registeredUser.id }, process.env.JWT_SECRET, {
                    expiresIn: "24h",
                });
                return {
                    success: true,
                    message: "Register successful",
                    token: `Bearer ${token}`,
                    user: {
                        id: registeredUser.id,
                        displayName: registeredUser.displayName,
                        emailId: registeredUser.emailId,
                    },
                };
            } else {
                return {
                    success: false,
                    message: "Google email not verified",
                };
            }
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return {
            success: true,
            message: "Login successful",
            token: `Bearer ${token}`,
            user: {
                id: user.id,
                displayName: user.displayName,
                emailId: user.emailId,
            },
        };
    } catch (error) {
        console.error("Error in findOrCreateUser:", error);
        return { success: false, message: "Internal server error" };
    }
};

export const getUserDataById = async (userId) => {
    try {
        const userData = await User.findOne({ _id: userId })

        if (!userData) {
            return "user data not found"
        }

        return userData
    } catch (error) {
        console.error(error)
    }
}