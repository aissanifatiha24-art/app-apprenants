const Apprenant = require("../models/Apprenant");

// @desc    Récupérer tous les apprenants
// @route   GET /api/apprenants
const getApprenants = async (req, res) => {
  try {
    const apprenants = await Apprenant.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: apprenants.length,
      data: apprenants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Créer un apprenant
// @route   POST /api/apprenants
const createApprenant = async (req, res) => {
  try {
    const apprenant = await Apprenant.create(req.body);
    res.status(201).json({
      success: true,
      data: apprenant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Récupérer un apprenant par ID
// @route   GET /api/apprenants/:id
const getApprenantById = async (req, res) => {
  try {
    const apprenant = await Apprenant.findById(req.params.id);
    if (!apprenant) {
      return res.status(404).json({
        success: false,
        message: "Apprenant non trouvé",
      });
    }
    res.json({
      success: true,
      data: apprenant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mettre à jour un apprenant
// @route   PUT /api/apprenants/:id
const updateApprenant = async (req, res) => {
  try {
    const apprenant = await Apprenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!apprenant) {
      return res.status(404).json({
        success: false,
        message: "Apprenant non trouvé",
      });
    }
    res.json({
      success: true,
      data: apprenant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Supprimer un apprenant
// @route   DELETE /api/apprenants/:id
const deleteApprenant = async (req, res) => {
  try {
    const apprenant = await Apprenant.findByIdAndDelete(req.params.id);
    if (!apprenant) {
      return res.status(404).json({
        success: false,
        message: "Apprenant non trouvé",
      });
    }
    res.json({
      success: true,
      message: "Apprenant supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getApprenants,
  createApprenant,
  getApprenantById,
  updateApprenant,
  deleteApprenant,
};
