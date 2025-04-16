import ngoService from "../services/ngo-service.js";

export const registerNGO = async (req, res) => {
    try {
        const ngo = await ngoService.createNGO(req.body);
        res.status(201).json(ngo);
    } catch (err) {
        console.error("Error registering NGO:", err.message);
        res.status(400).json({ error: err.message });
    }
};

export const getAllNGOs = async (req, res) => {
    try {
        const { status } = req.query; // Accept a status filter
        const query = status ? { status } : {}; // Filter NGOs by status
        const ngos = await ngoService.findAllNGOs(query);
        res.status(200).json(ngos);
    } catch (err) {
        console.error("Error fetching NGOs:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const updateNGOStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const ngo = await ngoService.updateNGOStatus(id, status);
        if (!ngo) {
            return res.status(404).json({ error: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (err) {
        console.error("Error updating NGO status:", err.message);
        res.status(500).json({ error: err.message });
    }
};


export const verifyNGO = async (req, res) => {
    try {
        const { id } = req.params;
        const ngo = await ngo.findByIdAndUpdate(
            id,
            { status: "verified" },
            { new: true }
        );

        if (!ngo) {
            return res.status(404).json({ error: "NGO not found" });
        }

        res.status(200).json(ngo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateNGO = async (req, res) => {
    const { id } = req.params;
    const ngoData = req.body;

    try {
        const updatedNgo = await ngoService.updateNGO(id, ngoData);
        if (!updatedNgo) {
            return res.status(404).json({ error: "NGO not found" });
        }
        res.status(200).json(updatedNgo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteNGO = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNgo = await ngoService.deleteNGO(id);
        if (!deletedNgo) {
            return res.status(404).json({ error: "NGO not found" });
        }
        res.status(200).json({ message: "NGO deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

