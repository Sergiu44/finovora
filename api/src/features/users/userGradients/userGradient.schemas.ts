import { z } from "zod";

export const createUserGradientSchema = z.object({
  to: z.string().length(7),
  from: z.string().length(7),
  name: z.string().min(3),
  slug: z.string().min(3),
});
