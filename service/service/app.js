import initializeRoutes from "./routers/index.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { AUTH_RATE_LIMIT_DEFAULTS, createAuthRateLimiter } from "./middleware/rate-limit.js";

const BODY_SIZE_LIMIT = "100kb";

// CORS_ORIGIN is a comma-separated list of allowed frontend origins.
// Unset: all origins are allowed in development, none in production.
const buildCorsOptions = () => {
    const origins = (process.env.CORS_ORIGIN ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (origins.length > 0) {
        return { origin: origins };
    }
    if (process.env.NODE_ENV === "production") {
        console.warn("CORS_ORIGIN is not set: cross-origin requests from browsers will be blocked.");
        return { origin: false };
    }
    return {};
};

// options.authRateLimit overrides the login/signup limits ({ limit, windowMs }), e.g. in tests
const initialize = async (app, options = {}) => {
    const authRateLimit = { ...AUTH_RATE_LIMIT_DEFAULTS, ...options.authRateLimit };

    // Behind a hosting proxy (Render, Railway, Heroku...), trust its X-Forwarded-For header
    // so rate limiting sees the client's IP instead of the proxy's
    if (process.env.TRUST_PROXY === "true") {
        app.set("trust proxy", 1);
    }

    // Security headers, CORS and request parsing (with a body size limit)
    app.use(helmet());
    app.use(cors(buildCorsOptions()));
    app.use(express.json({ limit: BODY_SIZE_LIMIT }));
    app.use(express.urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));

    // Connect to MongoDB (the only connection the app makes)
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_CONNECTION);
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error("Error connecting to MongoDB:", err.message);
            process.exit(1);
        }
    }

    // Brute-force protection: only failed logins count; every signup attempt counts
    app.post("/user/login", createAuthRateLimiter({ ...authRateLimit, skipSuccessfulRequests: true }));
    app.post("/user", createAuthRateLimiter(authRateLimit));

    // Initialize routes
    initializeRoutes(app);

    // Global error handling middleware
    app.use((err, req, res, next) => {
        const status = err.status || err.statusCode || 500;
        let message = "Internal Server Error";
        if (status === 413) {
            message = `Request body is too large (limit ${BODY_SIZE_LIMIT})`;
        } else if (err.type === "entity.parse.failed") {
            message = "Request body is not valid JSON";
        } else if (status < 500) {
            message = err.message;
        }
        if (status >= 500) {
            console.error("An error occurred:", err.stack);
        }
        res.status(status).json({ message });
    });

    // Catch-all route for undefined endpoints
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            code: "NotFound",
            message: "The requested resource was not found.",
        });
    });
};

// Build a fully configured app (connected to MONGO_CONNECTION) without starting a server.
// server.js adds listen(); tests pass the app straight to supertest.
export const createApp = async (options = {}) => {
    const app = express();
    await initialize(app, options);
    return app;
};

export default initialize;
