import type { Request, Response } from "express";
import * as categoryService from "./categories.service.ts";
import { sendSuccess } from "../../../helpers/apiResponse.ts";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.validation.ts";

export async function listCategories(req: Request, res: Response): Promise<void> {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const search = req.query.search ? String(req.query.search) : undefined;

  const result = await categoryService.listCategories(page, limit, { search });
  sendSuccess(res, 200, result, "Categories retrieved successfully");
}

export async function getCategory(req: Request<{ id: string }>, res: Response): Promise<void> {
  const result = await categoryService.getCategoryById(Number(req.params.id));
  sendSuccess(res, 200, result, "Category retrieved successfully");
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.id || "admin";
  const createdCategory = await categoryService.createCategory(req.body as CreateCategoryInput, userId);
  sendSuccess(res, 201, createdCategory, "Category created successfully");
}

export async function updateCategory(req: Request<{ id: string }>, res: Response): Promise<void> {
  const updatedCategory = await categoryService.updateCategory(
    Number(req.params.id),
    req.body as UpdateCategoryInput
  );
  sendSuccess(res, 200, updatedCategory, "Category updated successfully");
}

export async function deleteCategory(req: Request<{ id: string }>, res: Response): Promise<void> {
  await categoryService.deleteCategory(Number(req.params.id));
  sendSuccess(res, 200, null, "Category deleted successfully");
}