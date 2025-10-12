import axios from "axios";

// Auto-detect API URL based on current host
const getApiUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, use the same host as the frontend
  const hostname = window.location.hostname;
  const port = 5000;

  // If accessing via localhost, use localhost for API
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost:${port}/api`;
  }

  // Otherwise use the current hostname (network IP)
  return `http://${hostname}:${port}/api`;
};

const API_URL = getApiUrl();

console.log("🔌 API URL:", API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  updateSettings: (settings) => api.put("/auth/settings", settings),
};

// Habits API
export const habitsAPI = {
  getAll: () => api.get("/habits"),
  getOne: (id) => api.get(`/habits/${id}`),
  create: (habitData) => api.post("/habits", habitData),
  update: (id, habitData) => api.put(`/habits/${id}`, habitData),
  delete: (id) => api.delete(`/habits/${id}`),
};

// Completions API
export const completionsAPI = {
  getAll: (params) => api.get("/completions", { params }),
  create: (completionData) => api.post("/completions", completionData),
  update: (id, completionData) => api.put(`/completions/${id}`, completionData),
  delete: (id) => api.delete(`/completions/${id}`),
  getStats: (habitId) => api.get(`/completions/stats/${habitId}`),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
