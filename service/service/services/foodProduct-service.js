import FoodProduct from "./../models/food_product.js";

export const save = async (newFoodProduct) => {
    const foodProduct = new FoodProduct(newFoodProduct);
    return foodProduct.save();
}

// Get a pet by its ID from the database
export const getfoodProductById = async (foodProductId) => {
    return FoodProduct.findById(foodProductId); // Find the pet by its ID
};