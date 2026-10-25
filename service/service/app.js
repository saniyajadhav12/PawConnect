import initializeRoutes from "./routers/index.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const initialize = (app) => {
    // Middleware for CORS and parsing requests
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Connect to MongoDB
    mongoose
        .connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));

    // Initialize routes
    initializeRoutes(app);

    // Global error handling middleware
    app.use((err, req, res, next) => {
        console.error("An error occurred:", err.stack);
        res.status(err.status || 500).json({
            error: err.message || "Internal Server Error",
        });
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

export default initialize;
