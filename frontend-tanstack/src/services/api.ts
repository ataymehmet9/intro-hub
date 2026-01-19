import axios, { AxiosInstance } from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000");

// Token storage keys
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management utilities
export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  clearTokens: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenUtils.clearTokens();
      // Redirect to login will be handled by route guards
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

// Made with Bob
