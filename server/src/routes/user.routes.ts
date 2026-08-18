import { Router } from "express";

import { getAllUsers } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";

const router = Router();
router.get("/", authenticate, authorize("admin"), getAllUsers);

export default router;