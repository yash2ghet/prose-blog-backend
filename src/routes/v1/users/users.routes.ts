import { Router } from "express";
import * as usersController from "./users.controller.ts";

const usersRouter = Router();

usersRouter.get("/me", usersController.getProfile);
usersRouter.put("/me", usersController.updateProfile);

export default usersRouter;