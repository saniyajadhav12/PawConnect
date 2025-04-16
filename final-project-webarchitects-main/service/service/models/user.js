import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the schema for user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
}, { timestamps: true });

// Hash password before saving (Pre-save hook)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        // Hash the password with a salt factor of 10
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
