import type { Request, Response } from "express";
import * as blogsService from "./blogs.service.ts";
import { sendSuccess } from "../../../helpers/apiResponse.ts";
import type { CreateBlogInput, UpdateBlogInput } from "./blogs.validation.ts";

export async function listBlogs(req: Request, res: Response): Promise<void> {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const search = req.query.search ? String(req.query.search) : undefined;
  const status = req.query.status as "draft" | "published" | undefined;
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

  const result = await blogsService.listBlogs(page, limit, { search, status, categoryId });
  sendSuccess(res, 200, result, "Blogs retrieved successfully");
}

export async function getBlog(req: Request<{ id: string }>, res: Response): Promise<void> {
  const result = await blogsService.getBlogById(Number(req.params.id));
  sendSuccess(res, 200, result, "Blog retrieved successfully");
}

export async function createBlog(req: Request, res: Response): Promise<void> {
  const authorId = (req as any).user?.id || "admin";
  const createdBlog = await blogsService.createBlog(req.body as CreateBlogInput, authorId);
  sendSuccess(res, 201, createdBlog, "Blog created successfully");
}

export async function updateBlog(req: Request<{ id: string }>, res: Response): Promise<void> {
  const updatedBlog = await blogsService.updateBlog(Number(req.params.id), req.body as UpdateBlogInput);
  sendSuccess(res, 200, updatedBlog, "Blog updated successfully");
}

export async function deleteBlog(req: Request<{ id: string }>, res: Response): Promise<void> {
  await blogsService.deleteBlog(Number(req.params.id));
  sendSuccess(res, 200, null, "Blog deleted successfully");
}