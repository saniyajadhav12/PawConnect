import express from "express";
import { registerNGO, getAllNGOs, updateNGOStatus } from "../controllers/ngo-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { ngoSchema, ngoStatusSchema } from "../validation/schemas.js";

const router = express.Router();

// Register an NGO (any logged-in user); new NGOs start as "pending"
router.post("/", authenticate, validateBody(ngoSchema), registerNGO);
router.get("/", getAllNGOs);

// Approve or reject an NGO (admin only)
router.patch("/:id/status", authenticate, authorizeRoles("ADMIN"), validateBody(ngoStatusSchema), updateNGOStatus);

export default router;
