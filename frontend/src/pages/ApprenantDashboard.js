// frontend/src/pages/ApprenantDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Folder,
  ChevronRight,
} from "lucide-react";

const ApprenantDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "apprenant") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Données statiques
  const statsData = {
    formationsEnCours: 3,
    formationsTerminees: 12,
    prochaineSession: "Demain",
    ressourcesDisponibles: 28,
  };

  const formationsData = [
    {
      titre: "Gestion des opérations postales",
      date: "1 - 15 Jan - 15 Mar 2026",
      progression: 75,
    },
    {
      titre: "Sécurité informatique",
      date: "01 Fév - 30 Avr 2026",
      progression: 40,
    },
  ];

  const agendaData = [
    { titre: "Module 3 – Gestion de guichet", type: "Cours", horaire: "11:00" },
    {
      titre: "Quiz – Sécurité informatique",
      type: "Évaluation",
      horaire: "14:00",
    },
    { titre: "Atelier pratique – CCP", type: "Pratique", horaire: "18:45" },
  ];

  const progressionGlobale = 65;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressionGlobale / 100) * circumference;

  if (!isAuthenticated || user?.role !== "apprenant") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        {/* 4 CARTES STATISTIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="bg-amber-100 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.formationsEnCours}
              </div>
              <div className="text-xs text-gray-500">Formations en cours</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.formationsTerminees}
              </div>
              <div className="text-xs text-gray-500">Formations terminées</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.prochaineSession}
              </div>
              <div className="text-xs text-gray-500">Prochaine session</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Folder className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.ressourcesDisponibles}
              </div>
              <div className="text-xs text-gray-500">
                Ressources disponibles
              </div>
            </div>
          </div>
        </div>

        {/* SECTION MES FORMATIONS + PLANNING + PROGRESSION */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Mes formations
                </h2>
                <button className="text-sm text-amber-500 hover:text-amber-600 flex items-center gap-1">
                  Voir tout <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-4">
                {formationsData.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {item.titre}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.date}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        {item.progression}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.progression}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-5">
                Progression globale
              </h3>
              <div className="relative inline-block mb-4">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-3xl font-bold text-blue-600">
                    {progressionGlobale}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                7 formations sur 12 complétées
              </p>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Planning du jour</h3>
                <button className="text-sm text-amber-500 hover:text-amber-600">
                  Voir tout &gt;
                </button>
              </div>
              <div className="space-y-4">
                {agendaData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {item.titre}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.type}
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-gray-900">
                      {item.horaire}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprenantDashboard;
