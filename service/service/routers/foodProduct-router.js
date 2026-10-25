import express from "express";
import * as foodProductController from "./../controllers/foodProduct-controller.js"
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { foodProductSchema } from "../validation/schemas.js";

const router = express.Router();

// GET route to list all food products; POST to add one (admin only)
router.route('/')
    .get(foodProductController.getAllFoodProducts)
    .post(authenticate, authorizeRoles("ADMIN"), validateBody(foodProductSchema), foodProductController.post);


// GET route to retrieve a food product by its ID
router.route("/:foodProductId")
.get(foodProductController.getFoodProductById);


export default router;
