import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";
import * as ticketController from "../controllers/ticket.controller";

const router = Router();

router.use(authenticate); // every ticket route requires login

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.patch("/:id/status", authorize("support-engineer", "admin"), ticketController.updateTicketStatus);

export default router;