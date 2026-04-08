// frontend/src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Erreur requête:", error);
    return Promise.reject(error);
  },
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Réponse ${response.status} de ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ Erreur ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("❌ Pas de réponse du serveur:", error.request);
    } else {
      console.error("❌ Erreur:", error.message);
    }
    return Promise.reject(error);
  },
);

// Auth services
export const authService = {
  register: (userData) => {
    console.log("📝 Envoi inscription pour:", userData.email);
    return api.post("/auth/register", userData);
  },
  login: (credentials) => {
    console.log(
      "🔐 Envoi connexion pour:",
      credentials.matricule || credentials.email,
    );
    return api.post("/auth/login", credentials);
  },
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// Dashboard services
export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
};

// Formations services
export const formationsService = {
  getAll: () => api.get("/formations"),
  getOne: (id) => api.get(`/formations/${id}`),
  create: (data) => api.post("/formations", data),
  update: (id, data) => api.put(`/formations/${id}`, data),
  delete: (id) => api.delete(`/formations/${id}`),
};

// Apprenants services (pour admin) - CORRIGÉ
export const apprenantsService = {
  getAll: () => api.get("/users/apprenants"),
  getOne: (id) => api.get(`/users/apprenants/${id}`),
  create: (data) => api.post("/users/apprenants", data),
  update: (id, data) => api.put(`/users/apprenants/${id}`, data),
  delete: (id) => api.delete(`/users/apprenants/${id}`),
};

// Formateurs services (pour admin)
export const formateursService = {
  getAll: () => api.get("/users/formateurs"),
  getOne: (id) => api.get(`/users/formateurs/${id}`),
  create: (data) => api.post("/users/formateurs", data),
  update: (id, data) => api.put(`/users/formateurs/${id}`, data),
  delete: (id) => api.delete(`/users/formateurs/${id}`),
};

export default api;
