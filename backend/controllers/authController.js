// backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // ← Seul changement ici (bcryptjs → bcrypt)

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Inscription (création apprenant/formateur par admin)
const register = async (req, res) => {
  try {
    console.log("📝 Inscription:", req.body.email);

    const { nom, prenom, email, password, role, telephone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const prefix = role === "formateur" ? "AP-FORM" : "AP-APP";
    const count = await User.countDocuments({ role: role || "apprenant" });
    const number = String(count + 1).padStart(4, "0");
    const matricule = `${prefix}-${number}`;

    const user = new User({
      matricule,
      nom,
      prenom,
      email,
      password, // Sera hashé par le middleware pre('save')
      role: role || "apprenant",
      telephone: telephone || "",
    });

    await user.save();

    console.log("✅ Utilisateur créé:", email);

    res.status(201).json({
      _id: user._id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("❌ Erreur inscription:", error);
    res.status(500).json({ message: error.message });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { matricule, password } = req.body;
    console.log("🔐 Connexion:", matricule);

    const user = await User.findOne({
      $or: [{ matricule }, { email: matricule }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Matricule/Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Matricule/Email ou mot de passe incorrect" });
    }

    if (!user.actif) {
      return res.status(401).json({ message: "Compte désactivé" });
    }

    console.log("✅ Connexion réussie:", user.email);

    res.json({
      _id: user._id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("❌ Erreur connexion:", error);
    res.status(500).json({ message: error.message });
  }
};

// Profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      telephone: req.body.telephone,
      adresse: req.body.adresse,
    };
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
