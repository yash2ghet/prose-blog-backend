import { Router } from "express";
import * as blogsController from "./blogs.controller.ts";

const blogsRouter = Router();

blogsRouter.get("/", blogsController.listBlogs);
blogsRouter.get("/:id", blogsController.getBlog);
blogsRouter.post("/", blogsController.createBlog);
blogsRouter.put("/:id", blogsController.updateBlog);
blogsRouter.delete("/:id", blogsController.deleteBlog);

export default blogsRouter;