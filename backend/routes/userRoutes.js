// backend/routes/userRoutes.js - Version complète et corrigée
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".xlsx", ".xls", ".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Format de fichier non supporté"), false);
    }
  },
});

// Fonction utilitaire pour générer un matricule unique
async function generateUniqueMatricule(role, basePrefix) {
  let matricule = null;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 20;

  while (!isUnique && attempts < maxAttempts) {
    const count = await User.countDocuments({ role: role });
    const number = String(count + attempts + 1).padStart(4, "0");
    const testMatricule = `${basePrefix}-${number}`;

    const existing = await User.findOne({ matricule: testMatricule });
    if (!existing) {
      matricule = testMatricule;
      isUnique = true;
      console.log(`✅ Matricule unique généré: ${matricule}`);
    } else {
      console.log(
        `⚠️ Matricule ${testMatricule} existe déjà, tentative ${attempts + 1}`,
      );
    }
    attempts++;
  }

  if (!matricule) {
    matricule = `${basePrefix}-${Date.now()}`;
    console.log(`⚠️ Utilisation matricule timestamp: ${matricule}`);
  }

  return matricule;
}

// GET tous les apprenants
router.get("/apprenants", protect, admin, async (req, res) => {
  try {
    const apprenants = await User.find({ role: "apprenant" })
      .select("-password")
      .sort({ createdAt: -1 });
    console.log(`📋 ${apprenants.length} apprenants trouvés`);
    res.json(apprenants);
  } catch (error) {
    console.error("Erreur GET apprenants:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET tous les formateurs
router.get("/formateurs", protect, admin, async (req, res) => {
  try {
    const formateurs = await User.find({ role: "formateur" })
      .select("-password")
      .sort({ createdAt: -1 });
    console.log(`📋 ${formateurs.length} formateurs trouvés`);
    res.json(formateurs);
  } catch (error) {
    console.error("Erreur GET formateurs:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST créer un apprenant - avec adresse (sans hashage manuel)
router.post("/apprenants", protect, admin, async (req, res) => {
  try {
    console.log("📝 Création apprenant:", req.body.email);

    const { nom, prenom, email, password, telephone, adresse } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const matricule = await generateUniqueMatricule("apprenant", "AP-APP");

    // Le mot de passe en clair - le middleware pre('save') va le hasher automatiquement
    const user = await User.create({
      matricule,
      nom,
      prenom,
      email,
      password: password,
      role: "apprenant",
      telephone: telephone || "",
      adresse: adresse || "",
    });

    console.log(`✅ Apprenant créé: ${matricule} - ${email}`);

    res.status(201).json({
      _id: user._id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      adresse: user.adresse,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Erreur création apprenant:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Erreur: Matricule ou email en double. Veuillez réessayer.",
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// POST créer un formateur - avec adresse (sans hashage manuel)
router.post("/formateurs", protect, admin, async (req, res) => {
  try {
    console.log("📝 Création formateur:", req.body.email);

    const { nom, prenom, email, password, telephone, adresse } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont requis: nom, prenom, email, password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const matricule = await generateUniqueMatricule("formateur", "AP-FORM");

    // Le mot de passe en clair - le middleware pre('save') va le hasher automatiquement
    const user = await User.create({
      matricule,
      nom,
      prenom,
      email,
      password: password,
      role: "formateur",
      telephone: telephone || "",
      adresse: adresse || "",
    });

    console.log(`✅ Formateur créé: ${matricule} - ${email}`);

    res.status(201).json({
      _id: user._id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      adresse: user.adresse,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Erreur création formateur:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Erreur: Matricule ou email en double. Veuillez réessayer.",
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// DELETE supprimer un apprenant
router.delete("/apprenants/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(`✅ Apprenant supprimé: ${user.matricule}`);
    res.json({ message: "Apprenant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression apprenant:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE supprimer un formateur
router.delete("/formateurs/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(`✅ Formateur supprimé: ${user.matricule}`);
    res.json({ message: "Formateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression formateur:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST supprimer plusieurs utilisateurs (suppression multiple)
router.post("/delete-multiple", protect, admin, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ message: "Aucun utilisateur sélectionné" });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    console.log(`✅ ${result.deletedCount} utilisateurs supprimés`);

    res.json({
      message: `${result.deletedCount} utilisateur(s) supprimé(s) avec succès`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Erreur suppression multiple:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT activer/désactiver un apprenant
router.put("/apprenants/:id/status", protect, admin, async (req, res) => {
  try {
    const { actif } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { actif },
      { new: true },
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(
      `✅ Statut ${user.role} modifié: ${user.matricule} -> ${actif ? "Actif" : "Inactif"}`,
    );
    res.json(user);
  } catch (error) {
    console.error("Erreur changement statut:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT activer/désactiver un formateur
router.put("/formateurs/:id/status", protect, admin, async (req, res) => {
  try {
    const { actif } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { actif },
      { new: true },
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(
      `✅ Statut ${user.role} modifié: ${user.matricule} -> ${actif ? "Actif" : "Inactif"}`,
    );
    res.json(user);
  } catch (error) {
    console.error("Erreur changement statut:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST importer depuis Excel - Version complète avec adresse (sans hashage manuel)
router.post(
  "/import-excel",
  protect,
  admin,
  upload.single("file"),
  async (req, res) => {
    let filePath = null;

    try {
      console.log("📥 Début import Excel...");

      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier fourni" });
      }

      filePath = req.file.path;
      console.log(`Fichier reçu: ${req.file.originalname}`);

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      console.log(`📊 ${data.length} lignes trouvées`);

      if (data.length === 0) {
        return res.status(400).json({ message: "Le fichier Excel est vide" });
      }

      console.log(
        "📊 Structure de la première ligne:",
        JSON.stringify(data[0], null, 2),
      );

      const results = {
        success: 0,
        errors: 0,
        users: [],
        errorDetails: [],
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const nom = row.nom || row.Nom || row.NOM || row["Nom"];
          const prenom =
            row.prenom ||
            row.Prenom ||
            row.PRENOM ||
            row["Prénom"] ||
            row["Prenom"];
          const email = row.email || row.Email || row.EMAIL || row["Email"];
          const password =
            row.password ||
            row.Password ||
            row.PASSWORD ||
            row["Password"] ||
            "pass123";
          const telephone =
            row.telephone || row.Telephone || row.TEL || row["Téléphone"] || "";
          const adresse =
            row.adresse || row.Adresse || row.ADRESSE || row["Adresse"] || "";

          let role = "apprenant";
          const roleValue = row.role || row.Role || row.ROLE || row["Rôle"];
          if (roleValue && roleValue.toString().toLowerCase() === "formateur") {
            role = "formateur";
          }

          if (!nom || !prenom || !email) {
            results.errors++;
            results.errorDetails.push(
              `Ligne ${i + 2}: Champs requis manquants (nom, prenom, email)`,
            );
            continue;
          }

          const existing = await User.findOne({ email: email.toLowerCase() });
          if (existing) {
            results.errors++;
            results.errorDetails.push(
              `Ligne ${i + 2}: Email ${email} existe déjà`,
            );
            continue;
          }

          const prefix = role === "formateur" ? "AP-FORM" : "AP-APP";
          const matricule = await generateUniqueMatricule(role, prefix);

          // Mot de passe en clair - le middleware pre('save') va le hasher
          const user = await User.create({
            matricule,
            nom: nom,
            prenom: prenom,
            email: email.toLowerCase(),
            password: password,
            role: role,
            telephone: telephone,
            adresse: adresse,
          });

          results.success++;
          results.users.push({
            _id: user._id,
            matricule: user.matricule,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            telephone: user.telephone,
            adresse: user.adresse,
          });

          console.log(
            `✅ Importé: ${user.matricule} - ${user.email} (${user.role})`,
          );
        } catch (error) {
          results.errors++;
          results.errorDetails.push(`Ligne ${i + 2}: ${error.message}`);
          console.error(`❌ Erreur ligne ${i + 2}:`, error.message);
        }
      }

      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.log(
        `✅ Import terminé: ${results.success} succès, ${results.errors} erreurs`,
      );

      res.json({
        message: "Import terminé",
        success: results.success,
        errors: results.errors,
        users: results.users,
        errorDetails: results.errorDetails,
      });
    } catch (error) {
      console.error("❌ Erreur import:", error);

      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }

      res.status(500).json({
        message: "Erreur lors de l'import: " + error.message,
        error: error.toString(),
      });
    }
  },
);

module.exports = router;
