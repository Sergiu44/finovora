import { z } from "zod";

export const createAccountTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  userId: z.number(),
});

export const deletAccountTypeSchema = z.object({
  id: z.number(),
  userId: z.number(),
});
