import type { Request, Response } from "express";
import * as usersService from "./users.service.ts";
import { sendSuccess } from "../../../helpers/apiResponse.ts";
import type { UpdateProfileInput } from "./users.validation.ts";

export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.id;
  const profile = await usersService.getUserProfile(userId);
  sendSuccess(res, 200, profile, "Profile retrieved successfully");
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.id;
  const updated = await usersService.updateUserProfile(userId, req.body as UpdateProfileInput);
  sendSuccess(res, 200, updated, "Profile updated successfully");
}