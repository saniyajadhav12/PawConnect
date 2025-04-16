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
    }
});

const foodProductModel = mongoose.model('PetfoodProduct', FoodProductSchema);
export default foodProductModel;