import z from "zod";

// Helper to transform empty strings to null
const emptyStringToNull = z.string().transform((val) => (val.trim() === "" ? null : val.trim()));
const maxLength = z.string().max(255);
export const updateUserProfileSchema = z.object({
  firstName: emptyStringToNull.and(maxLength).nullable(),
  lastName: emptyStringToNull.and(maxLength).nullable(),
  username: emptyStringToNull.and(maxLength).nullable(),
  dateOfBirth: z.string().nullable(),
  statusMessage: z.string().trim().max(255).transform((val) => (val === "" ? null : val)).nullable(),
  bio: z.string().trim().max(500).transform((val) => (val === "" ? null : val)).nullable(),
  preferredStartDayOfMonth: z.coerce
    .number()
    .int()
    .min(1)
    .max(15),
  themePreference: z.enum(["light", "dark", "system"]),
  preferredCurrency: z.string().trim().max(10).transform((val) => (val === "" ? null : val)).nullable(),
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;

