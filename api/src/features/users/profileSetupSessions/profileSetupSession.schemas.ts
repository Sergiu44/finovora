import z from "zod";

export const createOrResumeProfileSetupSessionSchema = z.object({
  forceNew: z.boolean().optional(),
});

export type CreateOrResumeProfileSetupSessionSchema = z.infer<typeof createOrResumeProfileSetupSessionSchema>;

export const getProfileSetupSessionSchema = z.object({
  token: z.string().uuid(),
});

export type GetProfileSetupSessionSchema = z.infer<typeof getProfileSetupSessionSchema>;