const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const apprenantRoutes = require("./routes/apprenantRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connecté à MongoDB avec succès"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API fonctionne ! 🚀" });
});

app.use("/api/apprenants", apprenantRoutes);

// Middleware d'erreur
app.use(notFound);
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 Test API: http://localhost:${PORT}/api/test`);
});
