import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1).max(50),
  accountTypeId: z.string(),
  description: z.string().max(255).optional(),
  currencyId: z.string(),
  gradientId: z.number(),
  type: z.enum(["default", "user"]),
});

export const updateDefaultAccountSchema = z.object({
  accountId: z.number().refine((val) => !isNaN(val), {
    message: "Account ID must be a valid number",
  }),
});
