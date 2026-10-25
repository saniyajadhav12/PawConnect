import * as petService from "../services/pet-service.js";
import { setSuccess, setError } from "./response-handler.js";
import { isOwnerOrAdmin } from "../middleware/auth.js";

// POST request - Register a new pet (owned by the logged-in user)
export const post = async (request, response) => {
    try {
        const newPet = { ...request.body, createdBy: request.user._id };
        const pet = await petService.save(newPet);
        setSuccess(pet, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve a pet profile by ID
export const getPetById = async (request, response) => {
    try {
        const { petId } = request.params;
        const pet = await petService.getPetById(petId);
        if (!pet) {
            return response.status(404).json({ message: "Pet not found" });
        }
        setSuccess(pet, response);
    } catch (error) {
        setError(error, response);
    }
};

// PUT request - Update a pet profile by ID (creator or admin only)
export const updatePetById = async (request, response) => {
    try {
        const { petId } = request.params;
        const { createdBy, ...updates } = request.body ?? {};

        const pet = await petService.getPetById(petId);
        if (!pet) {
            return response.status(404).json({ message: "Pet not found" });
        }
        if (!isOwnerOrAdmin(pet.createdBy, request.user)) {
            return response.status(403).json({ message: "You are not authorized to update this pet" });
        }

        const updatedPet = await petService.updatePetById(petId, updates);
        setSuccess(updatedPet, response);
    } catch (error) {
        setError(error, response);
    }
};

// DELETE request - Remove a pet profile by ID (creator or admin only)
export const deletePetById = async (request, response) => {
    try {
        const { petId } = request.params;

        const pet = await petService.getPetById(petId);
        if (!pet) {
            return response.status(404).json({ message: "Pet not found" });
        }
        if (!isOwnerOrAdmin(pet.createdBy, request.user)) {
            return response.status(403).json({ message: "You are not authorized to delete this pet" });
        }

        await petService.deletePetById(petId);
        setSuccess({ message: "Pet deleted successfully" }, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve all pets
export const getAllPets = async (request, response) => {
    try {
        const pets = await petService.getAllPets();
        setSuccess(pets, response);
    } catch (error) {
        setError(error, response);
    }
};
