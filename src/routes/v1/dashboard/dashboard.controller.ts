import type { Request, Response } from "express";
import * as dashboardService from "./dashboard.service.ts";
import { sendSuccess } from "../../../helpers/apiResponse.ts";

export async function getStats(req: Request, res: Response): Promise<void> {
  const result = await dashboardService.getDashboardStats();
  sendSuccess(res, 200, result, "Dashboard statistics retrieved successfully");
}