import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const status = err instanceof AppError ? err.status : 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}