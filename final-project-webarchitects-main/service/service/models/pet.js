import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    size: { type: String, required: true }, // Size field
    disabilityStatus: { type: Boolean, required: true },
    healthConcerns: [{ type: String }],
    shelterLocation: { type: String, required: true },
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
