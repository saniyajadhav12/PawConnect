import mongoose from "mongoose";

const fundraiserSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        collectedAmount: { type: Number, default: 0 },
        ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Fundraiser = mongoose.model("Fundraiser", fundraiserSchema);

export default Fundraiser;
