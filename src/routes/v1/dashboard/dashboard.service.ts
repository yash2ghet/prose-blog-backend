import { count, eq } from "drizzle-orm";
import { db } from "../../../db/query.ts";
import { blogsTable } from "../../../db/schema/blogs.ts";
import { blogCategoriesTable } from "../../../db/schema/blogCategories.ts";

export async function getDashboardStats() {
  const [[totalBlogsResult], [publishedBlogsResult], [draftBlogsResult], [categoriesCountResult]] =
    await Promise.all([
      db.select({ count: count() }).from(blogsTable),
      db.select({ count: count() }).from(blogsTable).where(eq(blogsTable.status, "published")),
      db.select({ count: count() }).from(blogsTable).where(eq(blogsTable.status, "draft")),
      db.select({ count: count() }).from(blogCategoriesTable),
    ]);

  const recentBlogs = await db
    .select({
      id: blogsTable.id,
      title: blogsTable.title,
      status: blogsTable.status,
      createdAt: blogsTable.createdAt,
      categoryName: blogCategoriesTable.name,
    })
    .from(blogsTable)
    .innerJoin(blogCategoriesTable, eq(blogsTable.categoryId, blogCategoriesTable.id))
    .limit(5);

  return {
    stats: {
      totalBlogs: Number(totalBlogsResult?.count ?? 0),
      publishedBlogs: Number(publishedBlogsResult?.count ?? 0),
      draftBlogs: Number(draftBlogsResult?.count ?? 0),
      totalCategories: Number(categoriesCountResult?.count ?? 0),
    },
    recentBlogs,
  };
}