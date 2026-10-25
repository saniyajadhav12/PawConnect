import express from "express";
import {
    createFundraiser,
    getFundraisers,
    updateFundraiser,
    deleteFundraiser,
} from "../controllers/fundraiser-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { fundraiserSchema, fundraiserUpdateSchema } from "../validation/schemas.js";

const router = express.Router();

// POST: Create a fundraiser (NGO or admin)
router.post(
    "/",
    authenticate,
    authorizeRoles("NGO", "ADMIN"),
    validateBody(fundraiserSchema),
    createFundraiser
);

// GET: Retrieve all fundraisers (public)
router.get("/", getFundraisers);

// PATCH: Update a fundraiser (creator or admin, checked in the controller)
router.patch(
    "/:id",
    authenticate,
    authorizeRoles("NGO", "ADMIN"),
    validateBody(fundraiserUpdateSchema),
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
