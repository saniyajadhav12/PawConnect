import Fundraiser from "../models/fundraiser.js";
import NGO from "../models/ngo.js";

// Create a new fundraiser (NGO role only)
export const createFundraiser = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.body.ngo);
        if (!ngo || ngo.status !== "verified") {
            return res.status(403).json({ message: "NGO is not verified" });
        }

        const fundraiser = new Fundraiser(req.body);
        await fundraiser.save();
        res.status(201).json(fundraiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all fundraisers (accessible to all roles)
export const getFundraisers = async (req, res) => {
    try {
        const fundraisers = await Fundraiser.find().populate("ngo");
        res.status(200).json(fundraisers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a fundraiser (NGO role only)
export const updateFundraiser = async (req, res) => {
    try {
        const fundraiser = await Fundraiser.findById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ error: "Fundraiser not found" });
        }

        // Check if the logged-in user is the owner NGO of the fundraiser
        if (fundraiser.ngo.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ error: "You are not authorized to update this fundraiser" });
        }

        const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedFundraiser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a fundraiser (NGO role only)
export const deleteFundraiser = async (req, res) => {
    try {
        const fundraiser = await Fundraiser.findById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ error: "Fundraiser not found" });
        }

        // Check if the logged-in user is the owner NGO of the fundraiser
        if (fundraiser.ngo.toString() !== req.user.id) {
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
