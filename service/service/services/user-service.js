import User from "../models/user.js";

// Save a new user to the database
export const save = async (newUser) => {
    const user = new User(newUser);
    return await user.save();
};

// Get a user by its ID from the database (null if not found)
export const getUserById = async (userId) => {
    return await User.findById(userId);
};

// Get a user by its email, including the password hash for login (null if not found)
export const getUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

// Update a user profile by user ID (null if not found)
// Uses save() rather than findByIdAndUpdate so validation and password hashing run
export const updateUser = async (userId, updatedData) => {
    const user = await User.findById(userId);
    if (!user) {
        return null;
    }
    user.set(updatedData);
    return await user.save();
};

// Delete user by ID (null if not found)
export const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};
