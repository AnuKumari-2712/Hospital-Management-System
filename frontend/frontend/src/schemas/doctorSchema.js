import { z } from "zod";

export const doctorSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .optional()
    .or(z.literal("")),
  specialization: z.string().min(2, "Specialization is required"),
  department: z.string().min(1, "Please select a department"),
});