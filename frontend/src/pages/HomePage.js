// frontend/src/pages/HomePage.js
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Si connecté, rediriger vers le dashboard correspondant
  if (isAuthenticated && user) {
    let dashboardPath = "/";
    if (user.role === "admin") dashboardPath = "/admin";
    else if (user.role === "formateur") dashboardPath = "/formateur";
    else dashboardPath = "/apprenant";

    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#0066CC] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-4xl font-bold">AP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Algérie Poste E-Learning
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plateforme de formation en ligne pour les employés d'Algérie Poste
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0052a3] transition"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-[#0066CC] border border-[#0066CC] rounded-lg font-medium hover:bg-gray-50 transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
