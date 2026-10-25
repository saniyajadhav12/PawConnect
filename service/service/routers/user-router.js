import express from 'express';
import * as userController from "../controllers/user-controller.js";
import { authenticate, authorizeSelfOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST route to register a new user
router.route('/')
    .post(userController.post);

// POST route for user login
router.route("/login")
    .post(userController.loginUser);

// GET route for the logged-in user's profile (must be declared before /:userId)
router.route("/profile")
    .get(authenticate, userController.getProfile);

// Routes for a user by ID (only the user themselves or an admin)
router.route("/:userId")
    .all(authenticate, authorizeSelfOrAdmin("userId"))
    .get(userController.getUserById)
    .put(userController.updateUser)   // Update user by userId
    .delete(userController.deleteUser); // Delete user by userId

export default router;
