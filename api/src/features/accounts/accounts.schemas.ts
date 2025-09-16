import { z } from "zod";

export const updateDefaultAccountSchema = z.object({
  accountId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "Account ID must be a valid number",
    }),
});
