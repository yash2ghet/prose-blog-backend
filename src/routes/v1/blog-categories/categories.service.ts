import { and, eq, ilike, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../../db/query.ts";
import { blogCategoriesTable } from "../../../db/schema/blogCategories.ts";
import { blogsTable } from "../../../db/schema/blogs.ts";
import { AppError } from "../../../lib/AppError.ts";
import { getPagination } from "../../../helpers/pagination.ts";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.validation.ts";

interface CategoryFilters {
  search?: string;
}

export async function listCategories(pageInput: number, limitInput: number, filters: CategoryFilters) {
  const { page, limit, offset } = getPagination(pageInput, limitInput);

  const conditions: SQL<unknown>[] = [];

  if (filters.search) {
    const searchCondition = or(
      ilike(blogCategoriesTable.name, `%${filters.search}%`),
      ilike(blogCategoriesTable.slug, `%${filters.search}%`)
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: blogCategoriesTable.id,
        name: blogCategoriesTable.name,
        slug: blogCategoriesTable.slug,
        createdBy: blogCategoriesTable.createdBy,
        createdAt: blogCategoriesTable.createdAt,
        blogsCount: sql<number>`count(${blogsTable.id})::int`,
      })
      .from(blogCategoriesTable)
      .leftJoin(blogsTable, eq(blogsTable.categoryId, blogCategoriesTable.id))
      .where(where)
      .groupBy(blogCategoriesTable.id)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(blogCategoriesTable).where(where),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

export async function getCategoryById(id: number) {
  const category = (
    await db
      .select()
      .from(blogCategoriesTable)
      .where(eq(blogCategoriesTable.id, id))
      .limit(1)
  )[0];

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
}

export async function createCategory(data: CreateCategoryInput, userId: string) {
  const existingCategory = (
    await db
      .select()
      .from(blogCategoriesTable)
      .where(
        or(
          eq(blogCategoriesTable.slug, data.slug),
          eq(blogCategoriesTable.name, data.name)
        )
      )
      .limit(1)
  )[0];

  if (existingCategory) {
    throw new AppError(409, "A category with this name or slug already exists");
  }

  const [newCategory] = await db
    .insert(blogCategoriesTable)
    .values({
      ...data,
      createdBy: userId,
    })
    .returning();

  return newCategory;
}

export async function updateCategory(id: number, data: UpdateCategoryInput) {
  if (data.slug || data.name) {
    const checks: SQL<unknown>[] = [];
    if (data.slug) checks.push(eq(blogCategoriesTable.slug, data.slug));
    if (data.name) checks.push(eq(blogCategoriesTable.name, data.name));

    const existing = (
      await db
        .select()
        .from(blogCategoriesTable)
        .where(and(or(...checks), ne(blogCategoriesTable.id, id)))
        .limit(1)
    )[0];

    if (existing) {
      throw new AppError(409, "A category with this name or slug already exists");
    }
  }

  const [updatedCategory] = await db
    .update(blogCategoriesTable)
    .set(data)
    .where(eq(blogCategoriesTable.id, id))
    .returning();

  if (!updatedCategory) {
    throw new AppError(404, "Category not found");
  }

  return updatedCategory;
}

export async function deleteCategory(id: number) {
  const [deletedCategory] = await db
    .delete(blogCategoriesTable)
    .where(eq(blogCategoriesTable.id, id))
    .returning();

  if (!deletedCategory) {
    throw new AppError(404, "Category not found");
  }
}