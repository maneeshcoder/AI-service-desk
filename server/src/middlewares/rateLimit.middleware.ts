import { Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "../utils/AppError";

export function rateLimitAI(maxRequests: number, windowSeconds: number) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = `ratelimit:ai:${req.user!.userId}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (current > maxRequests) {
      throw new AppError("Too many AI requests — please wait a moment and try again", 429);
    }

    next();
  };
}