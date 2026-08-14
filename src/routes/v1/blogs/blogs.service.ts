import { and, eq, ilike, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../../db/query.ts";
import { blogsTable } from "../../../db/schema/blogs.ts";
import { blogCategoriesTable } from "../../../db/schema/blogCategories.ts";
import { user } from "../../../db/schema/users.ts";
import { AppError } from "../../../lib/AppError.ts";
import { getPagination } from "../../../helpers/pagination.ts";
import type { CreateBlogInput, UpdateBlogInput } from "./blogs.validation.ts";

interface BlogFilters {
  search?: string;
  status?: "draft" | "published";
  categoryId?: number;
}

export async function listBlogs(pageInput: number, limitInput: number, filters: BlogFilters) {
  const { page, limit, offset } = getPagination(pageInput, limitInput);
  const conditions: SQL<unknown>[] = [];

  if (filters.status) conditions.push(eq(blogsTable.status, filters.status));
  if (filters.categoryId) conditions.push(eq(blogsTable.categoryId, filters.categoryId));

  if (filters.search) {
    const searchCondition = or(
      ilike(blogsTable.title, `%${filters.search}%`),
      ilike(blogsTable.slug, `%${filters.search}%`),
      ilike(blogsTable.excerpt, `%${filters.search}%`)
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: blogsTable.id,
        title: blogsTable.title,
        slug: blogsTable.slug,
        excerpt: blogsTable.excerpt,
        featuredImage: blogsTable.featuredImage,
        isFeatured: blogsTable.isFeatured,
        status: blogsTable.status,
        createdAt: blogsTable.createdAt,
        updatedAt: blogsTable.updatedAt,
        category: {
          id: blogCategoriesTable.id,
          name: blogCategoriesTable.name,
        },
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(blogsTable)
      .innerJoin(blogCategoriesTable, eq(blogsTable.categoryId, blogCategoriesTable.id))
      .innerJoin(user, eq(blogsTable.authorId, user.id))
      .where(where)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(blogsTable).where(where),
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

export async function getBlogById(id: number) {
  const blog = (
    await db
      .select({
        id: blogsTable.id,
        title: blogsTable.title,
        slug: blogsTable.slug,
        excerpt: blogsTable.excerpt,
        content: blogsTable.content,
        featuredImage: blogsTable.featuredImage,
        isFeatured: blogsTable.isFeatured,
        status: blogsTable.status,
        categoryId: blogsTable.categoryId,
        authorId: blogsTable.authorId,
        seoTitle: blogsTable.seoTitle,
        seoDescription: blogsTable.seoDescription,
        createdAt: blogsTable.createdAt,
        updatedAt: blogsTable.updatedAt,
        categoryName: blogCategoriesTable.name,
      })
      .from(blogsTable)
      .innerJoin(blogCategoriesTable, eq(blogsTable.categoryId, blogCategoriesTable.id))
      .where(eq(blogsTable.id, id))
      .limit(1)
  )[0];

  if (!blog) {
    throw new AppError(404, "Blog post not found");
  }

  return blog;
}

export async function createBlog(data: CreateBlogInput, authorId: string) {
  const existingSlug = (
    await db
      .select({ id: blogsTable.id })
      .from(blogsTable)
      .where(eq(blogsTable.slug, data.slug))
      .limit(1)
  )[0];

  if (existingSlug) {
    throw new AppError(409, "A blog post with this slug already exists");
  }

  const [newBlog] = await db
    .insert(blogsTable)
    .values({
      ...data,
      authorId,
    })
    .returning();

  return newBlog;
}

export async function updateBlog(id: number, data: UpdateBlogInput) {
  if (data.slug) {
    const existingSlug = (
      await db
        .select({ id: blogsTable.id })
        .from(blogsTable)
        .where(and(eq(blogsTable.slug, data.slug), ne(blogsTable.id, id)))
        .limit(1)
    )[0];

    if (existingSlug) {
      throw new AppError(409, "A blog post with this slug already exists");
    }
  }

  const [updatedBlog] = await db
    .update(blogsTable)
    .set(data)
    .where(eq(blogsTable.id, id))
    .returning();

  if (!updatedBlog) {
    throw new AppError(404, "Blog post not found");
  }

  return updatedBlog;
}

export async function deleteBlog(id: number) {
  const [deletedBlog] = await db
    .delete(blogsTable)
    .where(eq(blogsTable.id, id))
    .returning();

  if (!deletedBlog) {
    throw new AppError(404, "Blog post not found");
  }
}