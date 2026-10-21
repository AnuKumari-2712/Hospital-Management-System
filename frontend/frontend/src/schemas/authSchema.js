import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password is too long"),
  role: z.enum(["patient", "doctor", "admin"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  rememberMe: z.boolean().optional(),
});