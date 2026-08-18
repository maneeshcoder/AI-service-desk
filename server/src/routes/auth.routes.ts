import { Router } from "express";
import { register,login,refresh,logout } from "../controllers/auth.controller.";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";

const router = Router();
router.post("/register", validate(registerSchema),register);
router.post("/login",validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// example: only admins can view all users
export default router;