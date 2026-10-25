import express from "express";
import {
    createFundraiser,
    getFundraisers,
    updateFundraiser,
    deleteFundraiser,
} from "../controllers/fundraiser-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST: Create a fundraiser (NGO or admin)
router.post(
    "/",
    authenticate,
    authorizeRoles("NGO", "ADMIN"),
    createFundraiser
);

// GET: Retrieve all fundraisers (public)
router.get("/", getFundraisers);

// PATCH: Update a fundraiser (creator or admin, checked in the controller)
router.patch(
    "/:id",
    authenticate,
    authorizeRoles("NGO", "ADMIN"),
    updateFundraiser
);

// DELETE: Delete a fundraiser (creator or admin, checked in the controller)
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("NGO", "ADMIN"),
    deleteFundraiser
);

export default router;
