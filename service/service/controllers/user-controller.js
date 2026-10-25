import jwt from "jsonwebtoken";
import * as userService from "../services/user-service.js";
import { setSuccess, setError } from "./response-handler.js";
import mongoose from "mongoose";

const TOKEN_EXPIRY = "1d";
const INVALID_CREDENTIALS = "Invalid email or password";

// Fields clients may never set themselves (roles are assigned in the database)
const withoutProtectedFields = ({ role, _id, ...data } = {}) => data;

// POST request - Register a new user
export const post = async (request, response) => {
    try {
        const newUser = withoutProtectedFields(request.body);
        const user = await userService.save(newUser);
        setSuccess(user, response);
    } catch (error) {
        setError(error, response);
    }
}

// GET request - Retrieve the logged-in user's profile
export const getProfile = async (request, response) => {
    setSuccess(request.user, response);
};

// GET request - Retrieve a user profile by ID
export const getUserById = async (request, response) => {
    try {
        const { userId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({ message: "Invalid user ID" });
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        setSuccess(user, response);
    } catch (error) {
        setError(error, response);
    }
};

// POST request - Login user
export const loginUser = async (request, response) => {
  try {
      const { email, password } = request.body;

      // Ensure both email and password are provided
      if (!email || !password) {
          return response.status(400).json({ message: "Email and password are required" });
      }

      // Same response for an unknown email and a wrong password, so emails can't be probed
      const user = await userService.getUserByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
          return response.status(401).json({ message: INVALID_CREDENTIALS });
      }

      const token = jwt.sign(
          { id: user._id.toString(), role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
      );

      setSuccess({ message: "Login successful", token, userId: user._id, user }, response);

  } catch (error) {
      console.error("Error during login:", error);
      setError(error, response);
  }
};

// PUT request - Update a user profile
export const updateUser = async (request, response) => {
    try {
        const { userId } = request.params; // Extract userId from request params
        const updatedData = withoutProtectedFields(request.body); // Get data to update from request body

        // Validate userId as a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({ message: "Invalid user ID" });
        }

        // Call service to update user details
        const updatedUser = await userService.updateUser(userId, updatedData);

        // Handle case where user does not exist
        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        // Return updated user details
        setSuccess(updatedUser, response);
    } catch (error) {
        // Handle errors during the update process
        console.error("Error updating user:", error);
        setError(error, response);
    }
};

// DELETE request - Delete a user profile
export const deleteUser = async (request, response) => {
    try {
        const { userId } = request.params; // Extract userId from request params

        // Validate userId as a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({ message: "Invalid user ID" });
        }

        // Call service to delete user by ID
        const deletedUser = await userService.deleteUser(userId);

        // Handle case where user does not exist
        if (!deletedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        // Return success message for deletion
        setSuccess({ message: "User deleted successfully" }, response);
    } catch (error) {
        // Handle errors during the deletion process
        console.error("Error deleting user:", error);
        setError(error, response);
    }
};
