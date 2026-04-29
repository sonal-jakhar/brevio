import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// request interceptor — runs before every API call
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("brevio_user");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;

    const isAuthPage =
      currentPath === "/login" || currentPath === "/register";

    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem("brevio_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;