import { Router } from "express";

import { getAllUsers, updateUserRole } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateRoleSchema } from "../validators/user.validators";

const router = Router();
router.get("/", authenticate, authorize("admin","support-engineer"), getAllUsers);
router.patch(
  "/:id/role",
  authenticate,
  authorize("admin"),
  validate(updateRoleSchema),
  updateUserRole
);
export default router;