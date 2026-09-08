import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimitAI } from "../middlewares/rateLimit.middleware";
import * as chatbotController from "../controllers/chatbot.controller";

const router = Router();
router.use(authenticate);

router.post("/message", rateLimitAI(20, 60), chatbotController.sendMessage);
router.post("/create-ticket", chatbotController.createTicketFromChat);

export default router;