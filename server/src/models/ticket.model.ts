import mongoose, { Schema, Document, Types } from "mongoose";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface ITicket extends Document {
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category?: string;
    aiSummary?: string;
    createdBy: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    createdAt: Date;
};


const ticketSchema = new Schema<ITicket>(
    {
        title: {
            type: String, 
            required: true,
             trim: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved", "closed"],
            default: "open",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        category: {
            type: String
        },
        aiSummary: {
            type: String
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timestamps: true }
);

ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdBy: 1 });


export default mongoose.model<ITicket>("Ticket", ticketSchema);