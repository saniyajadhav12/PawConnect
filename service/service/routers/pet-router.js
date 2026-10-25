import express from "express";
import * as PetController from "../controllers/pet-controller.js";

const router = express.Router();

// Fetch all pets
router.route("/").get(PetController.getAllPets);

// Register a new pet
router.route("/").post(PetController.post);

// Fetch a pet by ID
router.route("/:petId").get(PetController.getPetById);

// Update a pet by ID
router.route("/:petId").put(PetController.updatePetById);

// Delete a pet by ID
router.route("/:petId").delete(PetController.deletePetById);

export default router;
