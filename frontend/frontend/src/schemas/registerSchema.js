import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(64, "Password is too long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["patient", "doctor", "admin"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });