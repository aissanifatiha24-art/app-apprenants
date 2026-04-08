// frontend/src/components/Auth/LoginForm.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../../features/auth/authSlice";

const LoginForm = () => {
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  // Redirection après connexion
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "formateur") {
        navigate("/formateur", { replace: true });
      } else {
        navigate("/apprenant", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Afficher les erreurs
  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError("");
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!matricule.trim() || !password.trim()) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    setLocalError("");
    dispatch(clearError());
    dispatch(loginUser({ matricule, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-[#0066CC] rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AP</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Algérie Poste
          </h2>
          <p className="text-gray-500 text-sm">Plateforme E-Learning</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matricule ou Email
            </label>
            <input
              type="text"
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
              placeholder="ADMIN-001 ou admin@ap.dz"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0066CC] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#0052a3] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-[#0066CC] hover:underline">
              S'inscrire
            </Link>
          </div>

          {/* Compte de test */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              <strong>Compte admin de test</strong>
              <br />
              Matricule: ADMIN-001
              <br />
              Mot de passe: admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
