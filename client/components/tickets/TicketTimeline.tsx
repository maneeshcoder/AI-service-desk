"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface HistoryEntry {
  _id: string;
  field: "status" | "assignedTo";
  from?: string;
  to: string;
  changedBy: { name: string };
  createdAt: string;
}

function useTicketHistory(ticketId: string) {
  return useQuery<HistoryEntry[]>({
    queryKey: ["ticketHistory", ticketId],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}/history`);
      return data;
    },
  });
}

function describeChange(entry: HistoryEntry) {
  if (entry.field === "status") {
    return `changed status from "${entry.from}" to "${entry.to}"`;
  }
  return entry.from === "unassigned" ? `assigned this ticket` : `reassigned this ticket`;
}

export function TicketTimeline({ ticketId }: { ticketId: string }) {
  const { data: history, isLoading } = useTicketHistory(ticketId);

  if (isLoading) return null;
  if (!history?.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-slate-500">Activity</p>
      <div className="space-y-2">
        {history.map((entry) => (
          <div key={entry._id} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
            <span>
              <span className="font-medium text-slate-800">{entry.changedBy.name}</span>{" "}
              {describeChange(entry)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}