import { z } from "zod";

export const blogStatusEnum = z.enum(["draft", "published"]);

export const listBlogsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    status: blogStatusEnum.optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  }),
});

export const blogIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const baseBlogFields = {
  title: z.string().trim().min(1, "Title is required").max(255),
  slug: z.string().trim().min(1, "Slug is required").max(300),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().max(500).optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  status: blogStatusEnum.default("draft"),
  categoryId: z.number().int().positive("Category is required"),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
};

export const createBlogSchema = z.object({
  body: z.object(baseBlogFields),
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z
    .object(baseBlogFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field is required to update"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>["body"];
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>["body"];