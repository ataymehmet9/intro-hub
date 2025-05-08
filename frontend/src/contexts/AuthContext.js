import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  login,
  register,
  refreshToken,
  getCurrentUser,
} from "../services/auth";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshTokenValue, setRefreshTokenValue] = useState(
    localStorage.getItem("refreshToken") || null
  );

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // If token is expired, try to refresh
          if (refreshTokenValue) {
            try {
              const tokens = await refreshToken(refreshTokenValue);
              setToken(tokens.access);
              setRefreshTokenValue(tokens.refresh);
              localStorage.setItem("accessToken", tokens.access);
              localStorage.setItem("refreshToken", tokens.refresh);

              // Try to get user data again with new token
              const userData = await getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
            } catch (refreshError) {
              // If refresh fails, log out
              handleLogout();
            }
          } else {
            handleLogout();
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const data = await login(email, password);

      // Store tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setToken(data.access);
      setRefreshTokenValue(data.refresh);

      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);

      // Success notification and redirect
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/dashboard");

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (userData) => {
    try {
      setIsLoading(true);
      const data = await register(userData);

      // Automatically log in after successful registration
      await handleLogin(userData.email, userData.password);

      enqueueSnackbar("Account created successfully!", { variant: "success" });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear tokens and state
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshTokenValue(null);
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login
    navigate("/login");
    enqueueSnackbar("You have been logged out.", { variant: "info" });
  };

  // Update user profile
  const updateUserProfile = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
