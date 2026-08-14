import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { user } from "./users.js";
import { blogCategoriesTable } from "./blogCategories.js";

export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const blogsTable = pgTable("blogs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),

  featuredImage: varchar("featured_image", { length: 500 }),
  isFeatured: boolean("is_featured").default(false).notNull(),

  status: blogStatusEnum("status").default("draft").notNull(),

  categoryId: integer("category_id")
    .references(() => blogCategoriesTable.id)
    .notNull(),

  authorId: text("author_id")
    .references(() => user.id)
    .notNull(),

  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: varchar("seo_description", { length: 500 }),

  ...timestamps,
});

export const blogsRelations = relations(blogsTable, ({ one }) => ({
  author: one(user, { fields: [blogsTable.authorId], references: [user.id] }),
  category: one(blogCategoriesTable, { fields: [blogsTable.categoryId], references: [blogCategoriesTable.id] }),
}));