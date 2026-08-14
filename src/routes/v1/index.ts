import { Router } from "express";
import categoriesRouter from "./blog-categories/categories.routes.ts";
import blogsRouter from "./blogs/blogs.routes.ts";
import dashboardRouter from "./dashboard/dashboard.routes.ts";
import usersRouter from "./users/users.routes.ts";

const router = Router();

router.use("/dashboard", dashboardRouter);
router.use("/categories", categoriesRouter);
router.use("/blogs", blogsRouter);
router.use("/users", usersRouter);

export default router;