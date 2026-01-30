import { apiClient } from "~/services/api";

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: any;
}

// Login function
export const loginUser = async ({
  data,
}: {
  data: LoginInput;
}): Promise<AuthResponse> => {
  try {
    console.log("Attempting login with:", data);
    const response = await apiClient.post("/auth/login", data);
    console.log("Login response:", response);
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || error.message || "Login failed",
    );
  }
};

// Signup function
export const signupUser = async ({
  data,
}: {
  data: SignupInput;
}): Promise<AuthResponse> => {
  try {
    console.log("Attempting signup with:", data);
    const response = await apiClient.post("/auth/register", data);
    console.log("Signup response:", response);
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || error.message || "Signup failed",
    );
  }
};

// Get current user function
export const getCurrentUser = async (): Promise<any> => {
  try {
    console.log("Fetching current user");
    const response = await apiClient.get("/profile");
    console.log("Get user response:", response);
    return response.data;
  } catch (error: any) {
    console.error("Get user error:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch user data",
    );
  }
};

// Logout function (mainly for cleanup)
export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    // Call backend logout endpoint if it exists
    await apiClient.post("/auth/logout");
    return { success: true };
  } catch (error: any) {
    // Even if backend call fails, we'll clear tokens on client
    return { success: true };
  }
};

// Made with Bob
