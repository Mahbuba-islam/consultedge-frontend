// src/zod/resetPassword.validation.ts
import { z } from "zod";

export const resetPasswordZodSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    token: z.string().min(1, "Invalid or missing token"),
    email: z.string().email("Invalid email"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;