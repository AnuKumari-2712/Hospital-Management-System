import { z } from "zod";

export const bookAppointmentSchema = z.object({
  department: z.string().min(1, "Please select a department"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  type: z.enum(["in-person", "video"], {
    errorMap: () => ({ message: "Please select a consultation type" }),
  }),
  reason: z
    .string()
    .min(10, "Please describe your reason (at least 10 characters)")
    .max(500, "Reason is too long"),
});