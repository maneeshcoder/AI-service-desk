import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITicketHistory extends Document {
  ticket: Types.ObjectId;
  changedBy: Types.ObjectId;
  field: "status" | "assignedTo";
  from?: string;
  to: string;
  createdAt: Date;
}

const ticketHistorySchema = new Schema<ITicketHistory>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    field: { type: String, enum: ["status", "assignedTo"], required: true },
    from: { type: String },
    to: { type: String, required: true },
  },
  { timestamps: true }
);

ticketHistorySchema.index({ ticket: 1, createdAt: 1 });

export default mongoose.model<ITicketHistory>("TicketHistory", ticketHistorySchema);