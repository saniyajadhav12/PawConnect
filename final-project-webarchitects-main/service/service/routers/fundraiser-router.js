import express from "express";
import { createFundraiser, getFundraisers } from "../controllers/fundraiser-controller.js";

const router = express.Router();

// POST route for creating fundraisers
router.post("/", createFundraiser);

// GET route for retrieving all fundraisers
router.get("/", getFundraisers);

export default router;
