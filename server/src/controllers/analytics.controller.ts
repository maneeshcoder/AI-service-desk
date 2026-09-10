import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as analyticsService from "../services/analytics.service";

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await analyticsService.getDashboardStats();
  res.status(200).json(stats);
});