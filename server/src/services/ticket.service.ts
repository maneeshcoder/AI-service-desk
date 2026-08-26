import Ticket from "../models/ticket.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";
import TicketHistory from "../models/ticketHistory.model";
import { analyzeTicket } from "./ai.service";


interface CreateTicketInput {
  title: string;
  description: string;
  createdBy: string;
}

interface TicketQuery {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: "createdAt" | "priority";
  order?: "asc" | "desc";
}

export async function createTicket(input: CreateTicketInput) {
  const analysis = await analyzeTicket(input.title, input.description);

  return Ticket.create({
    ...input,
    category: analysis.category,
    priority: analysis.priority,
    aiSummary: analysis.summary,
  });
}

export async function getTickets(
  user: { userId: string; role: string },
  query: TicketQuery = {}
) {
  const filter: Record<string, any> = {};

  if (user.role === "employee") {
    filter.createdBy = user.userId;
  }

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  const sortField = query.sortBy ?? "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;

  return Ticket.find(filter)
    .sort({ [sortField]: sortOrder })
    .populate("createdBy", "name email");
}

export async function getTicketById(id: string, user: { userId: string; role: string }) {
  const ticket = await Ticket.findById(id).populate("createdBy", "name email");
  if (!ticket) throw new AppError("Ticket not found", 404);

  if (user.role === "employee" && ticket.createdBy._id.toString() !== user.userId) {
    throw new AppError("Forbidden", 403);
  }
  return ticket;
}

export async function updateTicketStatus(
  id: string,
  status: string,
  user: { userId: string; role: string }
) {
  if (user.role === "employee") {
    throw new AppError("Forbidden", 403);
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new AppError("Ticket not found", 404);

  const previousStatus = ticket.status;
  ticket.status = status as any;
  await ticket.save();

  await TicketHistory.create({
    ticket: id,
    changedBy: user.userId,
    field: "status",
    from: previousStatus,
    to: status,
  });

  return ticket;
}

export async function assignTicket(
  id: string,
  engineerId: string | null,
  user: { userId: string; role: string }
) {
  if (user.role === "employee") {
    throw new AppError("Forbidden", 403);
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new AppError("Ticket not found", 404);

  const previousAssignee = ticket.assignedTo?.toString() ?? "unassigned";
  ticket.assignedTo = engineerId ? (engineerId as any) : undefined;
  await ticket.save();

  await TicketHistory.create({
    ticket: id,
    changedBy: user.userId,
    field: "assignedTo",
    from: previousAssignee,
    to: engineerId ?? "unassigned",
  });

  return ticket;
}
export async function getTicketHistory(ticketId: string) {
  return TicketHistory.find({ ticket: ticketId })
    .sort({ createdAt: 1 })
    .populate("changedBy", "name role");
}