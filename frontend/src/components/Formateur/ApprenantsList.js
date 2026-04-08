// frontend/src/components/Formateur/ApprenantsList.js
import React, { useState, useEffect } from "react";
import { formationsService } from "../../services/api";

const ApprenantsList = ({ formateurId }) => {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApprenants();
  }, []);

  const fetchApprenants = async () => {
    try {
      const formations = await formationsService.getAll();
      const mesFormations = formations.data.filter(
        (f) => f.formateur?._id === formateurId,
      );

      // Collecter tous les apprenants uniques
      const tousApprenants = [];
      mesFormations.forEach((formation) => {
        formation.apprenants?.forEach((apprenant) => {
          if (!tousApprenants.find((a) => a._id === apprenant._id)) {
            tousApprenants.push({
              ...apprenant,
              formationTitre: formation.titre,
              progression: apprenant.progression || 0,
            });
          }
        });
      });
      setApprenants(tousApprenants);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApprenants = apprenants.filter(
    (apprenant) =>
      apprenant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Mes apprenants ({apprenants.length})
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un apprenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute left-3 top-2.5">🔍</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apprenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progression
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApprenants.map((apprenant) => (
              <tr key={apprenant._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${apprenant.nom}&background=4F46E5&color=fff`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {apprenant.nom}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {apprenant.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {apprenant.formationTitre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${apprenant.progression}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {apprenant.progression}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() =>
                      (window.location.href = `/formateur/apprenants/${apprenant._id}`)
                    }
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {apprenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Aucun apprenant inscrit à vos formations
          </p>
        </div>
      )}
    </div>
  );
};

export default ApprenantsList;
