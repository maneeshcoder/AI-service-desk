import Comment from "../models/comment.model";
import Ticket from "../models/ticket.model";
import { AppError } from "../utils/AppError";

export async function addComment(ticketId: string, authorId: string, message: string) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new AppError("Ticket not found", 404);

  return Comment.create({ ticket: ticketId, author: authorId, message });
}

export async function getCommentsForTicket(ticketId: string) {
  return Comment.find({ ticket: ticketId })
    .sort({ createdAt: 1 })
    .populate("author", "name role");
}