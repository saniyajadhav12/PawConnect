import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
});

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationId: { type: String, required: true },
    location: { type: locationSchema, required: true },
    contactInfo: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "verified"], default: "pending" },
});

const NGO = mongoose.model("NGO", ngoSchema);

export default NGO;
