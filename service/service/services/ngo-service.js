import NGO from "../models/ngo.js";

const createNGO = async (ngoData) => {
    const ngo = new NGO(ngoData);
    return await ngo.save();
};

const findNGOById = async (ngoId) => {
    return await NGO.findById(ngoId);
};

const findAllNGOs = async (query = {}) => {
    return await NGO.find(query); // Fetch NGOs based on query
};

const updateNGOStatus = async (ngoId, status) => {
    return await NGO.findByIdAndUpdate(ngoId, { status }, { new: true });
};

const updateNGO = async (ngoId, ngoData) => {
    return await NGO.findByIdAndUpdate(ngoId, ngoData, { new: true });
};

const deleteNGO = async (ngoId) => {
    return await NGO.findByIdAndDelete(ngoId);
};

export default { createNGO, findNGOById, findAllNGOs, updateNGO, deleteNGO };
