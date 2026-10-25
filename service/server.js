import dotenv from "dotenv";
import express from "express";
import initialize from "./service/app.js";

dotenv.config();

// Fail fast if required configuration is missing
const requiredEnvVars = ["MONGO_CONNECTION", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
    console.error(
        `Missing required environment variable(s): ${missingEnvVars.join(", ")}. ` +
        "Copy service/.env.example to service/.env and fill in the values."
    );
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3002;

await initialize(app);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
