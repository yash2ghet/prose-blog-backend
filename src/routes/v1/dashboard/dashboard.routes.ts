import { Router } from "express";
import * as dashboardController from "./dashboard.controller.ts";

const dashboardRouter = Router();

dashboardRouter.get("/stats", dashboardController.getStats);

export default dashboardRouter;