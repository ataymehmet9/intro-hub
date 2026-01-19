import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiClient } from "~/services/api";

// Login schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Signup schema
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

type LoginInput = z.infer<typeof LoginSchema>;
type SignupInput = z.infer<typeof SignupSchema>;

// Login server function
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LoginSchema.parse(data) as LoginInput)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  });

// Signup server function
export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SignupSchema.parse(data) as SignupInput)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  });

// Get current user server function
export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch user data");
    }
  },
);

// Logout server function (mainly for cleanup)
export const logoutUser = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      // Call backend logout endpoint if it exists
      await apiClient.post("/auth/logout");
      return { success: true };
    } catch (error: any) {
      // Even if backend call fails, we'll clear tokens on client
      return { success: true };
    }
  },
);

// Made with Bob
