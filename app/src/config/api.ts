import axios from "axios";
import { clearSession, getToken } from "./auth";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

// Shared client for all backend calls
const api = axios.create({ baseURL: API_BASE_URL });

// Attach the JWT to every request when the user is logged in
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the session is missing or no longer valid: clear it and send the user to log in.
// Login itself is excluded, since its 401 just means wrong credentials.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.endsWith("/user/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
