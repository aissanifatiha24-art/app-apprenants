// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import {
  fetchApprenants,
  fetchFormateurs,
  createApprenant,
  createFormateur,
  importUsersFromExcel,
  deleteMultipleUsers,
  toggleUserStatus,
} from "../features/users/usersSlice";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserPlus,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  UserCheck,
  UserX,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { apprenants, formateurs, loading } = useSelector(
    (state) => state.users,
  );

  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    matricule: "",
    password: "",
    telephone: "",
    adresse: "",
    role: "apprenant",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [importing, setImporting] = useState(false);

  // Tous les utilisateurs combinés
  const allUsers = [...apprenants, ...formateurs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // Calculs pour les stats
  const totalUsers = apprenants.length + formateurs.length;
  const activeUsers = [...apprenants, ...formateurs].filter(
    (u) => u.actif !== false,
  ).length;
  const inactiveUsers = totalUsers - activeUsers;

  const statsCards = [
    {
      title: "Total Utilisateurs",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
      up: true,
    },
    {
      title: "Apprenants",
      value: apprenants.length,
      icon: GraduationCap,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+8%",
      up: true,
    },
    {
      title: "Formateurs",
      value: formateurs.length,
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+5%",
      up: true,
    },
    {
      title: "Comptes actifs",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: `${Math.round((activeUsers / totalUsers) * 100)}%`,
      up: true,
    },
  ];

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/login");
      return;
    }
    dispatch(fetchApprenants());
    dispatch(fetchFormateurs());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    setSelectionMode(false);
    setSelectedUsers([]);
  }, [activeTab]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Activer le mode sélection (quand on clique sur la croix)
  const enableSelectionMode = () => {
    setSelectionMode(true);
    setSelectedUsers([]);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === displayedUsers.length) {
      setSelectedUsers([]);
    } else {
      const currentUserIds = displayedUsers.map((u) => u._id);
      setSelectedUsers(currentUserIds);
    }
  };

  // Confirmer la suppression multiple
  const handleConfirmDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      setErrors({ delete: "Aucun utilisateur sélectionné" });
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    if (
      window.confirm(
        `Supprimer ${selectedUsers.length} utilisateur(s) ? Cette action est irréversible.`,
      )
    ) {
      try {
        await dispatch(deleteMultipleUsers(selectedUsers)).unwrap();
        setSuccessMessage(
          `✅ ${selectedUsers.length} utilisateur(s) supprimé(s) avec succès !`,
        );
        setSelectionMode(false);
        setSelectedUsers([]);
      } catch (error) {
        console.error("Erreur suppression multiple:", error);
        setErrors({ delete: "Erreur lors de la suppression multiple" });
        setTimeout(() => setErrors({}), 3000);
      }
    }
  };

  // Annuler le mode sélection
  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedUsers([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newUser.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (newUser.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!newUser.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (newUser.prenom.length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    if (!newUser.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = "Format d'email invalide (ex: nom@domaine.com)";
    }

    if (!newUser.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (newUser.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (newUser.telephone && !/^0[0-9]{9}$/.test(newUser.telephone)) {
      newErrors.telephone = "Téléphone invalide (ex: 0550000000)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        nom: newUser.nom.trim(),
        prenom: newUser.prenom.trim(),
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        telephone: newUser.telephone || "",
        adresse: newUser.adresse || "",
      };

      if (newUser.role === "apprenant") {
        await dispatch(createApprenant(userData)).unwrap();
        setSuccessMessage("✅ Apprenant créé avec succès !");
      } else {
        await dispatch(createFormateur(userData)).unwrap();
        setSuccessMessage("✅ Formateur créé avec succès !");
      }

      setShowModal(false);
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        matricule: "",
        password: "",
        telephone: "",
        adresse: "",
        role: "apprenant",
      });
      setErrors({});
    } catch (error) {
      console.error("Erreur création:", error);
      setErrors({ submit: error.message || "Erreur lors de la création" });
    }
  };

  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) return;

    setImporting(true);
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const result = await dispatch(importUsersFromExcel(formData)).unwrap();
      setSuccessMessage(
        `✅ Import réussi ! ${result.success || 0} utilisateur(s) ajouté(s)`,
      );
      setExcelFile(null);
      e.target.reset();
    } catch (error) {
      setErrors({ import: error.message || "Erreur lors de l'import" });
      setTimeout(() => setErrors({}), 3000);
    } finally {
      setImporting(false);
    }
  };

  const handleToggleStatus = async (id, role, currentStatus) => {
    try {
      await dispatch(
        toggleUserStatus({ id, role, actif: !currentStatus }),
      ).unwrap();
      setSuccessMessage(
        `✅ Compte ${!currentStatus ? "activé" : "désactivé"} avec succès !`,
      );
    } catch (error) {
      console.error("Erreur changement statut:", error);
      setErrors({ status: "Erreur lors du changement de statut" });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchApprenants());
    dispatch(fetchFormateurs());
    setSuccessMessage("📋 Données actualisées !");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const generateMatricule = () => {
    const prefix = newUser.role === "apprenant" ? "AP-APP-" : "AP-FORM-";
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}${String(random).padStart(4, "0")}`;
  };

  const getDisplayedUsers = () => {
    switch (activeTab) {
      case "apprenants":
        return apprenants;
      case "formateurs":
        return formateurs;
      case "actifs":
        return allUsers.filter((u) => u.actif !== false);
      case "inactifs":
        return allUsers.filter((u) => u.actif === false);
      default:
        return allUsers;
    }
  };

  const displayedUsers = getDisplayedUsers();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 md:space-y-8 bg-slate-50 min-h-screen">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <AlertCircle size={18} />
          {errors.submit}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Tableau de bord administrateur
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez les utilisateurs, les formations et les statistiques
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl ring-1 ring-slate-200 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div
                className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color}`}
              >
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              {stat.up !== null && (
                <div
                  className={`flex items-center text-xs font-bold ${stat.up ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {stat.up ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="mt-3 md:mt-4">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                {stat.value}
              </h3>
              <p className="text-slate-500 font-medium text-xs md:text-sm">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Onglets et Tableau */}
      <div className="bg-white rounded-2xl md:rounded-3xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-4 md:px-6 pt-3 md:pt-4 overflow-x-auto">
          <div className="flex space-x-4 md:space-x-8 min-w-max">
            {[
              { id: "all", label: "Tous", count: allUsers.length },
              {
                id: "apprenants",
                label: "Apprenants",
                count: apprenants.length,
              },
              {
                id: "formateurs",
                label: "Formateurs",
                count: formateurs.length,
              },
              { id: "actifs", label: "Actifs", count: activeUsers },
              { id: "inactifs", label: "Inactifs", count: inactiveUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4 md:p-6 border-b border-gray-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >
                <UserPlus size={16} />
                Ajouter
              </button>

              {selectionMode && (
                <>
                  <button
                    onClick={handleConfirmDeleteSelected}
                    disabled={selectedUsers.length === 0}
                    className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Confirmer ({selectedUsers.length})
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    <CheckSquare size={16} />
                    {selectedUsers.length === displayedUsers.length &&
                    displayedUsers.length > 0
                      ? "Désélectionner tout"
                      : "Tout sélectionner"}
                  </button>
                  <button
                    onClick={cancelSelection}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    <X size={16} />
                    Annuler
                  </button>
                </>
              )}

              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >
                <RefreshCw size={16} />
                Rafraîchir
              </button>
            </div>

            <form
              onSubmit={handleImportExcel}
              className="flex flex-wrap items-center gap-3"
            >
              <label className="flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer">
                <FileText size={16} />
                Choisir fichier
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                type="submit"
                disabled={!excelFile || importing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Import...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Importer
                  </>
                )}
              </button>
            </form>
          </div>
          {excelFile && (
            <p className="text-xs text-emerald-600 mt-2">
              Fichier sélectionné: {excelFile.name}
            </p>
          )}
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                {selectionMode && (
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-10">
                    <button
                      onClick={handleSelectAll}
                      className="hover:text-emerald-600"
                    >
                      {selectedUsers.length === displayedUsers.length &&
                      displayedUsers.length > 0 ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Nom & Prénom
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Téléphone
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Adresse
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Date création
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  {selectionMode && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSelectUser(u._id)}
                        className="hover:text-emerald-600"
                      >
                        {selectedUsers.includes(u._id) ? (
                          <CheckSquare size={16} className="text-emerald-600" />
                        ) : (
                          <Square size={16} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                  )}
                  <td className="px-4 py-3 text-xs md:text-sm font-mono text-gray-900">
                    {u.matricule}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900">
                    {u.nom} {u.prenom}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                    {u.telephone || "-"}
                  </td>
                  <td
                    className="px-4 py-3 text-xs md:text-sm text-gray-500 max-w-[200px] truncate"
                    title={u.adresse}
                  >
                    {u.adresse || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        u.actif !== false
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.actif !== false ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(u._id, u.role, u.actif !== false)
                        }
                        className={`p-1 rounded-lg transition-colors ${
                          u.actif !== false
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={u.actif !== false ? "Désactiver" : "Activer"}
                      >
                        {u.actif !== false ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>
                      {/* La croix rouge - Active le mode sélection multiple */}
                      {!selectionMode && (
                        <button
                          onClick={enableSelectionMode}
                          className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Supprimer plusieurs"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={selectionMode ? 9 : 8}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJOUT UTILISATEUR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                Ajouter un utilisateur
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                      matricule: "",
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="apprenant">Apprenant</option>
                  <option value="formateur">Formateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.nom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nom: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.prenom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, prenom: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newUser.telephone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, telephone: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.telephone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0550000000"
                />
                {errors.telephone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.telephone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={newUser.adresse}
                  onChange={(e) =>
                    setNewUser({ ...newUser, adresse: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Adresse complète"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matricule
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.matricule}
                    onChange={(e) =>
                      setNewUser({ ...newUser, matricule: e.target.value })
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Auto-généré si vide"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewUser({
                        ...newUser,
                        matricule: generateMatricule(),
                      })
                    }
                    className="bg-gray-100 hover:bg-gray-200 px-4 rounded-xl text-sm font-medium transition-colors"
                  >
                    Générer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Minimum 6 caractères"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors mt-4"
              >
                Créer l'utilisateur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
