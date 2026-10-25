import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    try {
        // The token can outlive the account it was issued for
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: "You do not have permission to perform this action" });
        }
        next();
    };
};

// True if the user owns the resource (ownerId) or is an admin
export const isOwnerOrAdmin = (ownerId, user) => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return Boolean(ownerId) && ownerId.toString() === user.id;
};

// Only allow users to access their own account (by URL param), or admins any account
export const authorizeSelfOrAdmin = (paramName = "userId") => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!isOwnerOrAdmin(req.params[paramName], req.user)) {
            return res
                .status(403)
                .json({ message: "You do not have permission to perform this action" });
        }
        next();
    };
};
