import FoodProduct from "./../models/food_product.js";

export const save = async (newFoodProduct) => {
    const foodProduct = new FoodProduct(newFoodProduct);
    return foodProduct.save();
}

// Get all food products from the database
export const getAll = async () => {
    return FoodProduct.find();
};

// Get a food product by its ID from the database
export const getfoodProductById = async (foodProductId) => {
    return FoodProduct.findById(foodProductId); // Find the pet by its ID
};