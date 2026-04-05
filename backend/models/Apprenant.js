const mongoose = require("mongoose");

const apprenantSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "L'âge est requis"],
      min: [1, "Âge doit être supérieur à 0"],
      max: [120, "Âge doit être inférieur à 120"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Apprenant", apprenantSchema);
