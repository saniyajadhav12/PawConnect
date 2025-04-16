import * as userService from "../services/user-service.js";
import { setSuccess, setError } from "./response-handler.js";
import mongoose from "mongoose";

// POST request - Register a new user
export const post = async (request, response) => {
    try {
        const newUser = { ...request.body };
        const user = await userService.save(newUser);
        setSuccess(user, response);
    } catch (error) {
        setError(error, response);
    }
}

// GET request - Retrieve a user profile by ID
export const getUserById = async (request, response) => {
    try {
        const { userId } = request.params;
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

      // Fetch user by email
      const user = await userService.getUserByEmail(email);

      // If user does not exist, return 404
      if (!user) {
          return response.status(404).json({ message: "User not found" });
      }

      // Check if the password is correct
      const isPasswordValid = await user.comparePassword(password);

      // If password is incorrect, return 401
      if (!isPasswordValid) {
          return response.status(401).json({ message: "Wrong password" });
      }

      // If login is successful, return success response with user data
      setSuccess({ message: "Login successful", userId: user._id }, response);

  } catch (error) {
      console.error("Error during login:", error);
      setError(error, response);
  }
};

// PUT request - Update a user profile
export const updateUser = async (request, response) => {
    try {
        const { userId } = request.params; // Extract userId from request params
        const updatedData = { ...request.body }; // Get data to update from request body

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
