// frontend/src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import AdminDashboard from "./pages/AdminDashboard";
import FormateurDashboard from "./pages/FormateurDashboard";
import ApprenantDashboard from "./pages/ApprenantDashboard";
import { getProfile, logoutUser } from "./features/auth/authSlice";

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si non authentifié
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Calculer la classe de marge en fonction du rôle et de l'état du sidebar
  const getMarginClass = () => {
    if (!sidebarOpen) return "ml-20";
    if (user?.role === "apprenant") return "ml-64";
    return "ml-72";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`transition-all duration-300 ${getMarginClass()}`}>
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    user?.role === "admin"
                      ? "/admin"
                      : user?.role === "formateur"
                        ? "/formateur"
                        : "/apprenant"
                  }
                  replace
                />
              }
            />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/formateur/*" element={<FormateurDashboard />} />
            <Route path="/apprenant/*" element={<ApprenantDashboard />} />
            <Route
              path="/profile"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Mon Profil</h1>
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Paramètres</h1>
                </div>
              }
            />
            <Route
              path="/formations"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Formations</h1>
                </div>
              }
            />
            <Route
              path="/users"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Utilisateurs</h1>
                </div>
              }
            />
            <Route
              path="/services"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Services</h1>
                </div>
              }
            />
            <Route
              path="/statistiques"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Statistiques</h1>
                </div>
              }
            />
            <Route
              path="/cours"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Mes Cours</h1>
                </div>
              }
            />
            <Route
              path="/etudiants"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Mes Apprenants</h1>
                </div>
              }
            />
            <Route
              path="/evaluations"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Évaluations</h1>
                </div>
              }
            />
            <Route
              path="/mes-cours"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Mes cours</h1>
                </div>
              }
            />
            <Route
              path="/progres"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Ma Progression</h1>
                </div>
              }
            />
            <Route
              path="/certificats"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Certificats</h1>
                </div>
              }
            />
            <Route
              path="/mes-formations"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Mes formations</h1>
                </div>
              }
            />
            <Route
              path="/ressources"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Ressources</h1>
                </div>
              }
            />
            <Route
              path="/cahier-suivi"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Cahier de suivi</h1>
                </div>
              }
            />
            <Route
              path="/historique"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Historique</h1>
                </div>
              }
            />
            <Route
              path="/quiz"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Quiz</h1>
                </div>
              }
            />
            <Route
              path="/messages"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Messages</h1>
                </div>
              }
            />
            <Route
              path="/feedback"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Feedback</h1>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
