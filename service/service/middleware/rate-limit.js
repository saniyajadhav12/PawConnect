import { rateLimit } from "express-rate-limit";

export const AUTH_RATE_LIMIT_DEFAULTS = { limit: 10, windowMs: 15 * 60 * 1000 };

// Limits requests per IP to an auth endpoint and answers with a JSON 429 once exceeded.
// Behind a hosting proxy, set TRUST_PROXY=true so the client's real IP is used.
export const createAuthRateLimiter = ({ limit, windowMs, skipSuccessfulRequests = false }) =>
    rateLimit({
        windowMs,
        limit,
        skipSuccessfulRequests,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: (req, res) => {
            const minutes = Math.ceil(windowMs / 60000);
            res.status(429).json({
                message: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            });
        },
    });
