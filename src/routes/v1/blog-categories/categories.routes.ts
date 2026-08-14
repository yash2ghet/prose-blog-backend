import { Router } from "express";
import * as categoryController from "./categories.controller.ts";

const categoriesRouter = Router();

categoriesRouter.get("/", categoryController.listCategories);
categoriesRouter.get("/:id", categoryController.getCategory);
categoriesRouter.post("/", categoryController.createCategory);
categoriesRouter.put("/:id", categoryController.updateCategory);
categoriesRouter.delete("/:id", categoryController.deleteCategory);

export default categoriesRouter;