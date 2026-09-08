import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as chatbotService from "../services/chatbot.service";
import * as ticketService from "../services/ticket.service";

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId, message } = req.body;
  const response = await chatbotService.continueChat(sessionId, message);
  res.status(200).json(response);
});

export const createTicketFromChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body;
  const conversation = await chatbotService.getFullConversation(sessionId);

  const { ticket } = await ticketService.createTicket({
    title: req.body.title || "Issue reported via AI chat",
    description: conversation,
    createdBy: req.user!.userId,
  });

  res.status(201).json(ticket);
});