
import { Router } from "express";
import authRoutes from "./auth.routes";
import ticketRoutes from "./ticket.routes";
import userRoutes from "./user.routes";
import chatbotRoutes from "./chatbot.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/users", userRoutes);
router.use("/chatbot", chatbotRoutes);

export default router;


