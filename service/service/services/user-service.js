import mongoose from "mongoose";
import User from "../models/user.js";

// Save a new user to the database
export const save = async (newUser) => {
    try {
        const user = new User(newUser);
        return await user.save();
    } catch (error) {
        throw new Error(`Error saving user: ${error.message}`);
    }
};

// Get a user by its ID from the database
export const getUserById = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID");
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error(`Error retrieving user by ID: ${error.message}`);
    }
};

// Get a user by its email from the database
export const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error(`Error retrieving user by email: ${error.message}`);
    }
};

// Update a user profile by user ID
export const updateUser = async (userId, updatedData) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID");
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

// Delete user by ID
export const deleteUser = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID");
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        return deletedUser;
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};
