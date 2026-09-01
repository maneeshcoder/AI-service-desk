import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as ticketService from "../services/ticket.service";
import { suggestSolution } from "../services/ai.service";

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const { ticket, potentialDuplicates }  = await ticketService.createTicket({
    title,
    description,
    createdBy: req.user!.userId,
  });
  res.status(201).json({ ...ticket.toObject(), potentialDuplicates });
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, status, priority, sortBy, order } = req.query;
  const tickets = await ticketService.getTickets(req.user!, {
    search: search as string,
    status: status as string,
    priority: priority as string,
    sortBy: sortBy as "createdAt" | "priority",
    order: order as "asc" | "desc",
  });
  res.status(200).json(tickets);
});

export const getTicketById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.getTicketById(req.params.id as string, req.user!);
  res.status(200).json(ticket);
});

export const updateTicketStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.updateTicketStatus(req.params.id as string, req.body.status, req.user!);
  res.status(200).json(ticket);
});

export const assignTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { engineerId } = req.body;
  const ticket = await ticketService.assignTicket(id!, engineerId || null, req.user!);
  res.status(200).json(ticket);
});

export const getTicketHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const history = await ticketService.getTicketHistory(id!);
  res.status(200).json(history);
});

export const getSuggestedSolution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const ticket = await ticketService.getTicketById(id!, req.user!);
  const suggestion = await suggestSolution(ticket.title, ticket.description, ticket.category ?? "other");
  res.status(200).json(suggestion);
});