import { z } from "zod";

export const listCategoriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const baseCategoryFields = {
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z.string().trim().min(1, "Slug is required").max(150),
};

export const createCategorySchema = z.object({
  body: z.object(baseCategoryFields),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z
    .object(baseCategoryFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field is required to update"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];