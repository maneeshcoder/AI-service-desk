import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});


export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!id || Array.isArray(id)) {
  res.status(400);
  throw new Error("Invalid ID");
}
  const user = await userService.updateUserRole(id, role, req.user!);
  res.status(200).json(user);
});