import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as chatbotService from "../services/chatbot.service";
import * as ticketService from "../services/ticket.service";
import { AppError } from "../utils/AppError";

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId, message } = req.body;
  const response = await chatbotService.continueChat(sessionId, message);
  res.status(200).json(response);
});

export const createTicketFromChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body;
  const conversation = await chatbotService.getFullConversation(sessionId);
  if (!conversation || conversation.trim().length < 10) {
    throw new AppError(
      "Your conversation session may have expired. Please describe your issue again.",
      400
    );
  }
  const { ticket } = await ticketService.createTicket({
    title: req.body.title || "Issue reported via AI chat",
    description: conversation,
    createdBy: req.user!.userId,
  });

  res.status(201).json(ticket);
});