import mongoose from "mongoose";

const FoodProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    nutritionDetails: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const foodProductModel = mongoose.model('PetfoodProduct', FoodProductSchema);
export default foodProductModel;