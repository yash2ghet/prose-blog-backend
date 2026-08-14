import { relations } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { user } from "./users.js";
import { blogsTable } from "./blogs.js";

export const blogCategoriesTable = pgTable("blog_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),

  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),

  ...timestamps,
});

export const blogCategoriesRelations = relations(blogCategoriesTable, ({ one, many }) => ({
  creator: one(user, { fields: [blogCategoriesTable.createdBy], references: [user.id] }),
  blogs: many(blogsTable),
}));