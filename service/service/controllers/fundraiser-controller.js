import Fundraiser from "../models/fundraiser.js";
import NGO from "../models/ngo.js";
import { isOwnerOrAdmin } from "../middleware/auth.js";

// Create a new fundraiser (NGO or admin, for an approved NGO)
export const createFundraiser = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.body.ngo);
        if (!ngo || ngo.status !== "approved") {
            return res.status(403).json({ message: "NGO is not approved" });
        }

        const fundraiser = new Fundraiser({ ...req.body, createdBy: req.user._id });
        await fundraiser.save();
        res.status(201).json(fundraiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all fundraisers (public)
export const getFundraisers = async (req, res) => {
    try {
        const fundraisers = await Fundraiser.find().populate("ngo");
        res.status(200).json(fundraisers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a fundraiser (creator or admin only)
export const updateFundraiser = async (req, res) => {
    try {
        const fundraiser = await Fundraiser.findById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ error: "Fundraiser not found" });
        }

        // Check if the logged-in user created the fundraiser
        if (!isOwnerOrAdmin(fundraiser.createdBy, req.user)) {
            return res
                .status(403)
                .json({ error: "You are not authorized to update this fundraiser" });
        }

        const { createdBy, ...updates } = req.body ?? {};
        const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.status(200).json(updatedFundraiser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a fundraiser (creator or admin only)
export const deleteFundraiser = async (req, res) => {
    try {
        const fundraiser = await Fundraiser.findById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ error: "Fundraiser not found" });
        }

        // Check if the logged-in user created the fundraiser
        if (!isOwnerOrAdmin(fundraiser.createdBy, req.user)) {
            return res
                .status(403)
                .json({ error: "You are not authorized to delete this fundraiser" });
        }

        await Fundraiser.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Fundraiser deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
