import express from "express";
import { registerNGO, getAllNGOs } from "../controllers/ngo-controller.js";

const router = express.Router();

router.post("/", registerNGO);
router.get("/", getAllNGOs);

export default router;
