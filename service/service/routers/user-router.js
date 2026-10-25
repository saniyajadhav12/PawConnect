import express from 'express';
import * as userController from "../controllers/user-controller.js";

const router = express.Router();

// POST route to register a new user
router.route('/')
    .post(userController.post);

// GET route to retrieve a user by its ID
router.route("/:userId")
    .get(userController.getUserById)
    .put(userController.updateUser)   // Update user by userId
    .delete(userController.deleteUser); // Delete user by userId

// POST route for user login
router.route("/login")
    .post(userController.loginUser);

export default router;