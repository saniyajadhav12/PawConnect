import foodProductModel from "../models/food_product.js";
import * as FoodProductService from "./../services/foodProduct-service.js"
import { setSuccess, setError } from "./response-handler.js"; // Import response handler functions

export const post = async (request, response) => {
    try{
    const newfoodProduct = {...request.body};
    const foodProduct = await FoodProductService.save(newfoodProduct);
    setSuccess(foodProduct, response);
    } catch(error) {
        setError(response, error);
    }
}

// GET request - Retrieve a pet profile by ID
export const getFoodProductById = async (request, response) => {
    try {
        const { foodProductId } = request.params; // Get foodProductId from URL parameters
        const foodProduct = await foodProductModel.findById(foodProductId); // Query the food product model to get the product by ID

        if (!foodProduct) {
            return response.status(404).json({ message: "Food product not found" }); // Handle case where food product is not found
        }

        setSuccess(foodProduct, response); // Send success response with the food product details
    } catch (error) {
        setError(response, error); // Send error response if something goes wrong
    }
};
