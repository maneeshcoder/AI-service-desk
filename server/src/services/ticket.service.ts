import Ticket from "../models/ticket.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";

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
  return Ticket.create(input);
}

export async function getTickets(user: { userId: string; role: string }, query: TicketQuery = {}) {
  if (user.role === "employee") {
    return Ticket.find({ createdBy: user.userId }).sort({ createdAt: -1 });
  }
  // support-engineer and admin  
  return Ticket.find().sort({ createdAt: -1 }).populate("createdBy", "name email");
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
  const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
  if (!ticket) throw new AppError("Ticket not found", 404);
  return ticket;
}