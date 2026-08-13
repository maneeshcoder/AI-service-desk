import { Router } from "express";
import { register,login,refresh,logout } from "../controllers/auth.controller.";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// example: only admins can view all users
router.get("/users", authenticate, authorize("admin"), getAllUsers);
export default router;