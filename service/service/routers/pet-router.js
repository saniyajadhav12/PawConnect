import express from "express";
import * as PetController from "../controllers/pet-controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { petSchema, petUpdateSchema } from "../validation/schemas.js";

const router = express.Router();

// Fetch all pets
router.route("/").get(PetController.getAllPets);

// Register a new pet (any logged-in user)
router.route("/").post(authenticate, validateBody(petSchema), PetController.post);

// Fetch a pet by ID
router.route("/:petId").get(PetController.getPetById);

// Update a pet by ID (creator or admin, checked in the controller)
router.route("/:petId").put(authenticate, validateBody(petUpdateSchema), PetController.updatePetById);

// Delete a pet by ID (creator or admin, checked in the controller)
router.route("/:petId").delete(authenticate, PetController.deletePetById);

export default router;
