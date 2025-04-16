import express from "express";
import {
    createFundraiser,
    getFundraisers,
    updateFundraiser,
    deleteFundraiser,
} from "../controllers/fundraiser-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST: Create a fundraiser (NGO role only)
router.post(
    "/",
    authenticate,
    authorizeRoles("NGO"),
    createFundraiser
);

// GET: Retrieve all fundraisers (accessible to all roles)
router.get(
    "/",
    authenticate,
    authorizeRoles("USER", "NGO", "ADMIN"),
    getFundraisers
);

// PATCH: Update a fundraiser (NGO role only)
router.patch(
    "/:id",
    authenticate,
    authorizeRoles("NGO"),
    updateFundraiser
);

// DELETE: Delete a fundraiser (NGO role only)
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("NGO"),
    deleteFundraiser
);

export default router;
