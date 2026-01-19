import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiClient } from "~/services/api";

// Update profile schema
const UpdateProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

// Change password schema
const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// Update profile server function
export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) => UpdateProfileSchema.parse(data) as UpdateProfileInput,
  )
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.put("/users/profile", data);
      return {
        success: true,
        user: response.data,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  });

// Change password server function
export const changePassword = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) => ChangePasswordSchema.parse(data) as ChangePasswordInput,
  )
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/users/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      return {
        success: true,
        message: response.data.message || "Password changed successfully",
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change password",
      );
    }
  });

// Upload profile picture server function
export const uploadProfilePicture = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/users/profile-picture", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        profile_image: response.data.profile_image,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload profile picture",
      );
    }
  });

// Delete account server function
export const deleteAccount = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const schema = z.object({
      password: z.string().min(8, "Password is required"),
    });
    return schema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.delete("/users/account", {
        data: { password: data.password },
      });
      return {
        success: true,
        message: response.data.message || "Account deleted successfully",
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete account",
      );
    }
  });

// Export user data server function
export const exportUserData = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await apiClient.get("/users/export", {
        responseType: "blob",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to export user data",
      );
    }
  },
);

// Made with Bob
