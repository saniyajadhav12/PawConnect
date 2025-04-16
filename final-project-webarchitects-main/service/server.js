import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import CORS middleware
import petRouter from "./service/routers/pet-router.js"; // Import the pet router
import initialize from "./service/app.js";
import fundraiserRouter from "./service/routers/fundraiser-router.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors()); // Add CORS middleware here
app.use(express.json()); // Add JSON body parser
app.use("/pets", petRouter); // Use pet routes
app.use("/api/fundraisers", fundraiserRouter);


// Initialize other services (if any)
initialize(app);

// Start the server
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
