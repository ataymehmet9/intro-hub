import api from "./api";

type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
  token: string;
};

type RegisterResponse = {
  user: Record<string, any>;
};

type RefreshTokenResponse = {
  access: string;
  refresh: string;
};

export type User = {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  company?: string;
  position?: string;
  [key: string]: any;
};

type UpdateProfileResponse = User;

type ChangePasswordData = {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
};

/**
 * Log in a user
 * @param email - User email
 * @param password - User password
 * @returns API response with tokens and user data
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

/**
 * Register a new user
 * @param userData - User registration data
 * @returns API response with user data
 */
export const register = async (
  userData: Record<string, any>
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", userData);
  return response.data;
};

/**
 * Refresh the access token
 * @param refreshToken - Refresh token
 * @returns API response with new tokens
 */
export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>("/auth/refresh", {
    refresh: refreshToken,
  });
  return response.data;
};

/**
 * Get the current user's profile
 * @returns API response with user data
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/profile");
  return response.data;
};

/**
 * Update the user's profile
 * @param userData - User profile data to update
 * @returns API response with updated user data
 */
export const updateProfile = async (
  userData: Record<string, any>
): Promise<UpdateProfileResponse> => {
  const response = await api.patch<UpdateProfileResponse>("/profile", userData);
  return response.data;
};

/**
 * Change the user's password
 * @param passwordData - Password change data (old_password, new_password, new_password_confirm)
 * @returns API response
 */
export const changePassword = async (
  passwordData: ChangePasswordData
): Promise<any> => {
  const response = await api.post("/auth/change-password", passwordData);
  return response.data;
};
