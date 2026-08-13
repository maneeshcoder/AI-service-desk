import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as ticketService from "../services/ticket.service";

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const ticket = await ticketService.createTicket({
    title,
    description,
    createdBy: req.user!.userId,
  });
  res.status(201).json(ticket);
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tickets = await ticketService.getTickets(req.user!);
  res.status(200).json(tickets);
});

export const getTicketById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.getTicketById(req.params.id, req.user!);
  res.status(200).json(ticket);
});

export const updateTicketStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.updateTicketStatus(req.params.id, req.body.status, req.user!);
  res.status(200).json(ticket);
});