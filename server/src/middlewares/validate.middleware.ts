import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export function validate(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(err);
    }
  };
}