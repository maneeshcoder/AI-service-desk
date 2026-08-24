import { z } from "zod";

export const addCommentSchema = z.object({
  message: z.string().trim().min(1, "Comment cannot be empty").max(1000),
});