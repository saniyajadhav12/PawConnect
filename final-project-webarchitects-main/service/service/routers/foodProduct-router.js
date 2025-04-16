import express from "express";
import * as foodProductController from "./../controllers/foodProduct-controller.js"

const router = express.Router();

router.route('/')
    .post(foodProductController.post);


// GET route to retrieve a pet by its ID
router.route("/:foodProductId")
.get(foodProductController.getFoodProductById);


export default router;
