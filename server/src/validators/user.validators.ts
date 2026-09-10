import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["employee", "support-engineer", "admin"]),
});