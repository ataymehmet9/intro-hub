import api from "./api";

/**
 * Log in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response with tokens and user data
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response with user data
 */
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  // /api/v1/auth/register
  return response.data;
};

/**
 * Refresh the access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} - API response with new tokens
 */
export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh", { refresh: refreshToken });
  return response.data;
};

/**
 * Get the current user's profile
 * @returns {Promise} - API response with user data
 */
export const getCurrentUser = async () => {
  const response = await api.get("/profile");
  return response.data;
};

/**
 * Update the user's profile
 * @param {Object} userData - User profile data to update
 * @returns {Promise} - API response with updated user data
 */
export const updateProfile = async (userData) => {
  const response = await api.patch("/profile", userData);
  return response.data;
};

/**
 * Change the user's password
 * @param {Object} passwordData - Password change data (old_password, new_password, new_password_confirm)
 * @returns {Promise} - API response
 */
export const changePassword = async (passwordData) => {
  const response = await api.post("/auth/change-password", passwordData);
  return response.data;
};
