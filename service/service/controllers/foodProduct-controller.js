import foodProductModel from "../models/food_product.js";
import * as FoodProductService from "./../services/foodProduct-service.js"
import { setSuccess, setError } from "./response-handler.js"; // Import response handler functions

export const post = async (request, response) => {
    try{
    const newfoodProduct = {...request.body};
    const foodProduct = await FoodProductService.save(newfoodProduct);
    setSuccess(foodProduct, response);
    } catch(error) {
        setError(error, response);
    }
}

// GET request - Retrieve all food products
export const getAllFoodProducts = async (request, response) => {
    try {
        const foodProducts = await FoodProductService.getAll();
        setSuccess(foodProducts, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve a food product by ID
export const getFoodProductById = async (request, response) => {
    try {
        const { foodProductId } = request.params; // Get foodProductId from URL parameters
        const foodProduct = await foodProductModel.findById(foodProductId); // Query the food product model to get the product by ID

        if (!foodProduct) {
            return response.status(404).json({ message: "Food product not found" }); // Handle case where food product is not found
        }

        setSuccess(foodProduct, response); // Send success response with the food product details
    } catch (error) {
        setError(error, response); // Send error response if something goes wrong
    }
};
