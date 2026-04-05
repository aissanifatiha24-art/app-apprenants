import React, { useState } from "react";
import api from "../services/api";

const ApprenantList = ({
  apprenants,
  onApprenantDeleted,
  onApprenantUpdated,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) {
      try {
        await api.delete(`/apprenants/${id}`);
        onApprenantDeleted(id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = (apprenant) => {
    setEditingId(apprenant._id);
    setEditForm(apprenant);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/apprenants/${editingId}`, editForm);
      onApprenantUpdated(response.data.data);
      setEditingId(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  if (apprenants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        Aucun apprenant pour le moment. Ajoutez-en un !
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
        📋 Liste des apprenants ({apprenants.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Prénom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Âge</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apprenants.map((apprenant) => (
              <tr key={apprenant._id} className="border-t hover:bg-gray-50">
                {editingId === apprenant._id ? (
                  <>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="nom"
                        value={editForm.nom}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="prenom"
                        value={editForm.prenom}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        name="age"
                        value={editForm.age}
                        onChange={handleChange}
                        className="border p-1 rounded w-20"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Annuler
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3">{apprenant.nom}</td>
                    <td className="px-6 py-3">{apprenant.prenom}</td>
                    <td className="px-6 py-3">{apprenant.email}</td>
                    <td className="px-6 py-3">{apprenant.age} ans</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEdit(apprenant)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(apprenant._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprenantList;
