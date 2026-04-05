import React, { useState, useEffect } from "react";
import ApprenantForm from "../components/ApprenantForm";
import ApprenantList from "../components/ApprenantList";
import api from "../services/api";

const HomePage = () => {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    chargerApprenants();
  }, []);

  const chargerApprenants = async () => {
    try {
      const response = await api.get("/apprenants");
      setApprenants(response.data.data);
    } catch (error) {
      setMessage("❌ Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleApprenantAdded = (newApprenant) => {
    setApprenants([newApprenant, ...apprenants]);
    setMessage("✅ Apprenant ajouté avec succès !");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleApprenantDeleted = (id) => {
    setApprenants(apprenants.filter((a) => a._id !== id));
    setMessage("✅ Apprenant supprimé avec succès !");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleApprenantUpdated = (updatedApprenant) => {
    setApprenants(
      apprenants.map((a) =>
        a._id === updatedApprenant._id ? updatedApprenant : a,
      ),
    );
    setMessage("✅ Apprenant modifié avec succès !");
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          📚 Gestion des Apprenants
        </h1>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {message}
          </div>
        )}

        <ApprenantForm onApprenantAdded={handleApprenantAdded} />
        <ApprenantList
          apprenants={apprenants}
          onApprenantDeleted={handleApprenantDeleted}
          onApprenantUpdated={handleApprenantUpdated}
        />
      </div>
    </div>
  );
};

export default HomePage;
