// backend/scripts/createTestUsers.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    await User.deleteMany({
      email: { $in: ["apprenant@test.com", "formateur@test.com"] },
    });
    console.log("🗑️ Anciens utilisateurs supprimés");

    await User.create({
      matricule: "AP-APP-9999",
      nom: "Test",
      prenom: "Apprenant",
      email: "apprenant@test.com",
      password: "apprenant123",
      role: "apprenant",
      telephone: "0550000001",
      adresse: "Alger",
      actif: true,
    });
    console.log("✅ Apprenant créé");

    await User.create({
      matricule: "AP-FORM-9999",
      nom: "Test",
      prenom: "Formateur",
      email: "formateur@test.com",
      password: "formateur123",
      role: "formateur",
      telephone: "0550000002",
      adresse: "Alger",
      actif: true,
    });
    console.log("✅ Formateur créé");

    console.log("\n📋 Comptes de test :");
    console.log("Admin     : ADMIN-001 / admin123");
    console.log("Apprenant : apprenant@test.com / apprenant123");
    console.log("Formateur : formateur@test.com / formateur123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Erreur:", error);
    await mongoose.disconnect();
  }
};

createTestUsers();
