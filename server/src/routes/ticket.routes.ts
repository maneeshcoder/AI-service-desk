import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";
import * as ticketController from "../controllers/ticket.controller";
import { validate } from "../middlewares/validate.middleware";
import { createTicketSchema, updateStatusSchema } from "../../validators/ticket.validators";

const router = Router();

router.use(authenticate); // every ticket route requires login

router.post("/",validate(createTicketSchema) ,ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.patch("/:id/status",validate(updateStatusSchema) , authorize("support-engineer", "admin"), ticketController.updateTicketStatus);

export default router;