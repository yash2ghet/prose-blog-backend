import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    image: z.string().url().optional().or(z.literal("")),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];