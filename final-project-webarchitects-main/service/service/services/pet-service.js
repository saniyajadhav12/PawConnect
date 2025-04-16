import PetModel from "./../models/pet.js";

// Service to fetch all pets
export const getAllPets = async () => {
    return await PetModel.find(); // Return all pet records from the database
};

// Service to fetch a pet by its ID
export const getPetById = async (id) => {
    return await PetModel.findById(id); // Query MongoDB by ID
};

// Service to save a new pet
export const save = async (petData) => {
    const pet = new PetModel(petData);
    return await pet.save(); // Save the new pet record
};

// Service to update a pet by ID
export const updatePetById = async (id, updates) => {
    return await PetModel.findByIdAndUpdate(id, updates, { new: true }); // Update pet and return the updated document
};

// Service to delete a pet by ID
export const deletePetById = async (id) => {
    return await PetModel.findByIdAndDelete(id); // Delete the pet by ID
};
