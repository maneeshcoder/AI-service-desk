import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";
import { getDashboardStats } from "../controllers/analytics.controller";

const router = Router();
router.get("/dashboard", authenticate, authorize("admin"), getDashboardStats);

export default router;