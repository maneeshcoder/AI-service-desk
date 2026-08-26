import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/rbac.middleware";
import * as ticketController from "../controllers/ticket.controller";
import { validate } from "../middlewares/validate.middleware";
import { createTicketSchema, updateStatusSchema  } from "../validators/ticket.validators";
import {addCommentSchema } from "../validators/comment.validators";
import { addComment, getComments } from "../controllers/comment.controller";

const router = Router();

router.use(authenticate); // every ticket route requires login

router.post("/",validate(createTicketSchema) ,ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.patch("/:id/status",validate(updateStatusSchema) , authorize("support-engineer", "admin"), ticketController.updateTicketStatus);
router.post("/:id/comments", validate(addCommentSchema), addComment);
router.get("/:id/comments", getComments);
router.patch(
  "/:id/assign",
  authorize("support-engineer", "admin"),
  ticketController.assignTicket
);
router.get("/:id/history", ticketController.getTicketHistory);
router.get(
  "/:id/suggestion",
  authorize("support-engineer", "admin"),
  ticketController.getSuggestedSolution
);
export default router;