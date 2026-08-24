import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as commentService from "../services/comment.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
  throw new Error("Invalid ticket ID");
}
  const { message } = req.body;
  const comment = await commentService.addComment(id!, req.user!.userId, message);
  res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
  throw new Error("Invalid ticket ID");
}
  const comments = await commentService.getCommentsForTicket(id!);
  res.status(200).json(comments);
});