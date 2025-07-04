import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  login,
  register,
  refreshToken,
  getCurrentUser,
  type User,
} from "@services/auth";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: any) => Promise<any>;
  logout: () => void;
  updateUserProfile: (updatedUserData: Partial<User>) => void;
};

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    localStorage.getItem("refreshToken") || null
  );

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          console.log("Attempting to fetch user data...");
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          console.log("User data fetched successfully:", userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (refreshTokenValue) {
            try {
              console.log("Attempting to refresh token...");
              const tokens = await refreshToken(refreshTokenValue);
              setToken(tokens.access);
              setRefreshTokenValue(tokens.refresh);
              localStorage.setItem("accessToken", tokens.access);
              localStorage.setItem("refreshToken", tokens.access);

              const userData = await getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
              console.log(
                "Token refreshed and user data fetched successfully."
              );
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
              handleLogout();
            }
          } else {
            console.log("No refresh token available. Logging out.");
            handleLogout();
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No token found. Skipping authentication.");
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await login(email, password);

      console.log(data);

      // Store tokens
      localStorage.setItem("accessToken", data.token);
      //localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.token);
      setToken(data.access);
      setRefreshTokenValue(data.refresh);

      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);

      // Success notification and redirect
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/dashboard");

      return data;
    } catch (error: any) {
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
  const handleSignup = async (userData: any) => {
    try {
      setIsLoading(true);
      const data = await register(userData);

      // Automatically log in after successful registration
      await handleLogin(userData.email, userData.password);

      enqueueSnackbar("Account created successfully!", { variant: "success" });
      return data;
    } catch (error: any) {
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
    console.log("handleLogout called");
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
  const updateUserProfile = (updatedUserData: Partial<User>) => {
    setUser(
      (prevUser) =>
        ({
          ...prevUser,
          ...updatedUserData,
        } as User)
    );
  };

  // Context value
  const value: AuthContextType = {
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
