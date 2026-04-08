// frontend/src/components/Formations/FormationList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formationsService } from "../../services/api";

const FormationList = ({ formateurId }) => {
  const [formations, setFormations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await formationsService.getAll();
      // Filtrer les formations du formateur connecté
      const mesFormations = response.data.filter(
        (f) => f.formateur?._id === formateurId,
      );
      setFormations(mesFormations);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFormations = () => {
    if (filter === "all") return formations;
    return formations.filter((f) => f.statut === filter);
  };

  const getStatusBadge = (statut) => {
    const badges = {
      planifiee: "bg-gray-100 text-gray-800",
      en_cours: "bg-yellow-100 text-yellow-800",
      terminee: "bg-green-100 text-green-800",
      annulee: "bg-red-100 text-red-800",
    };
    const labels = {
      planifiee: "Planifiée",
      en_cours: "En cours",
      terminee: "Terminée",
      annulee: "Annulée",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div>
      {/* Filtres */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter("planifiee")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "planifiee"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Planifiées
        </button>
        <button
          onClick={() => setFilter("en_cours")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "en_cours"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter("terminee")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "terminee"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Terminées
        </button>
      </div>

      {/* Liste des formations */}
      <div className="space-y-4">
        {getFilteredFormations().map((formation) => (
          <div
            key={formation._id}
            className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {formation.titre}
                  </h3>
                  {getStatusBadge(formation.statut)}
                </div>

                <p className="mt-2 text-gray-600">{formation.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">📅 Date de début:</span>
                    <span className="ml-2 font-medium">
                      {new Date(formation.dateDebut).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">📅 Date de fin:</span>
                    <span className="ml-2 font-medium">
                      {new Date(formation.dateFin).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      👥 Apprenants inscrits:
                    </span>
                    <span className="ml-2 font-medium">
                      {formation.apprenants?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">⏱️ Durée:</span>
                    <span className="ml-2 font-medium">
                      {formation.duree} heures
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Link
                  to={`/formateur/formations/${formation._id}/edit`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                >
                  Modifier
                </Link>
                <Link
                  to={`/formateur/formations/${formation._id}/apprenants`}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  Voir apprenants
                </Link>
              </div>
            </div>
          </div>
        ))}

        {formations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Aucune formation trouvée</p>
            <Link
              to="/formateur/formations/nouvelle"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Créer ma première formation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationList;
