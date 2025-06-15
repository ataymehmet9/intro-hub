/**
 * Utility functions for handling JWT tokens
 */

// Token key names in localStorage
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "accessToken"; //'refreshToken';

/**
 * Get the access token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set the access token in localStorage
 * @param {string} token - The access token to store
 */
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Set the refresh token in localStorage
 * @param {string} token - The refresh token to store
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Remove all authentication tokens from localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if a token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} Whether the token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  try {
    // JWT tokens are in the format header.payload.signature
    // We only need the payload part
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    // Check if token has an expiration time (exp)
    if (!decoded.exp) {
      return false;
    }

    // Convert exp to milliseconds (JWT exp is in seconds)
    const expirationTime = decoded.exp * 1000;

    // Compare with current time
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get user data from a JWT token
 * @param {string} token - The JWT token
 * @returns {Object|null} User data from the token payload or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    // JWT tokens are in the format header.payload.signature
    // We only need the payload part
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if user is authenticated (has a valid, non-expired token)
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return token && !isTokenExpired(token);
};
