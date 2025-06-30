/**
 * Utility functions for handling JWT tokens
 */

// Token key names in localStorage
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Get the access token from localStorage
 * @returns The access token or null if not found
 */
const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token from localStorage
 * @returns The refresh token or null if not found
 */
const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set the access token in localStorage
 * @param token - The access token to store
 */
const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Set the refresh token in localStorage
 * @param token - The refresh token to store
 */
const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Remove all authentication tokens from localStorage
 */
const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if a token is expired
 * @param token - The JWT token to check
 * @returns Whether the token is expired
 */
const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  try {
    // JWT tokens are in the format header.payload.signature
    // We only need the payload part
    const payload = token.split(".")[1];
    const decoded: { exp?: number } = JSON.parse(atob(payload));

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
 * @param token - The JWT token
 * @returns User data from the token payload or null if invalid
 */
const getUserFromToken = (token: string | null): Record<string, any> | null => {
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
 * @returns Whether the user is authenticated
 */
const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
};

export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  isTokenExpired,
  getUserFromToken,
  isAuthenticated,
};
