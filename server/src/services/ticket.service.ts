import Ticket from "../models/ticket.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";

interface CreateTicketInput {
  title: string;
  description: string;
  createdBy: string;
}

export async function createTicket(input: CreateTicketInput) {
  return Ticket.create(input);
}

export async function getTickets(user: { userId: string; role: string }) {
  if (user.role === "employee") {
    return Ticket.find({ createdBy: user.userId }).sort({ createdAt: -1 });
  }
  // support-engineer and admin  
  return Ticket.find().sort({ createdAt: -1 }).populate("createdBy", "name email");
}

export async function getTicketById(id: string, user: { userId: string; role: string }) {
  const ticket = await Ticket.findById(id).populate("createdBy", "name email");
  if (!ticket) throw new Error("Ticket not found");

  if (user.role === "employee" && ticket.createdBy._id.toString() !== user.userId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
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
  if (!ticket) throw new Error("Ticket not found");
  return ticket;
}