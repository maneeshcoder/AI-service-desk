import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(150),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
});

export const updateStatusSchema = z.object({
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;