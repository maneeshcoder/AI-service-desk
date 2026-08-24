"use client";

import { useTickets } from "@/hooks/useTickets";
import { Ticket } from "@/types";
import Link from "next/link";

const STATUS_STYLES: Record<Ticket["status"], string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const PRIORITY_STYLES: Record<Ticket["priority"], string> = {
  low: "text-slate-500",
  medium: "text-slate-700",
  high: "text-amber-700",
  urgent: "text-red-700",
};

export function TicketList() {
  const { data: tickets, isLoading, isError } = useTickets();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading tickets…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Couldn't load tickets. Try refreshing.</p>;
  }

  if (!tickets?.length) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg">
        <p className="text-sm text-slate-500">No tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 bg-white">
      {tickets.map((ticket) => (
       <Link
          key={ticket._id}
          href={`/employee/tickets/${ticket._id}`}
          className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{ticket.title}</p>
            <p className="text-sm text-slate-500 truncate">{ticket.description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${STATUS_STYLES[ticket.status]}`}
            >
              {ticket.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}