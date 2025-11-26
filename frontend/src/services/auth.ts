import { api } from "./api";
import { User, LoginCredentials, SignupData } from "@/types/intro-hub";

// Authentication API endpoints (matching Go backend)
const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/profile", // Changed from /auth/me to /profile
};

// Login user
export const login = async (
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> => {
  const response = await api.post<{ user: User; token: string }>(
    AUTH_ENDPOINTS.LOGIN,
    credentials
  );
  return response;
};

// Register new user
export const register = async (
  userData: SignupData
): Promise<{ user: User; token: string }> => {
  const response = await api.post<{ user: User; token: string }>(
    AUTH_ENDPOINTS.REGISTER,
    userData
  );
  return response;
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(AUTH_ENDPOINTS.PROFILE);
  return response;
};

// Update user profile
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  const response = await api.put<User>(AUTH_ENDPOINTS.PROFILE, userData);
  return response;
};
