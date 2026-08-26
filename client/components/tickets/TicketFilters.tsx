"use client";

import { Ticket } from "@/types";

interface Props {
  search: string;
  status: string;
  priority: string;
  sortOrder: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onSortOrderChange: (v: string) => void;
}

const STATUS_OPTIONS: Array<Ticket["status"] | ""> = ["", "open", "in-progress", "resolved", "closed"];
const PRIORITY_OPTIONS: Array<Ticket["priority"] | ""> = ["", "low", "medium", "high", "urgent"];

export function TicketFilters({
  search,
  status,
  priority,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortOrderChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tickets…"
        className="w-full sm:flex-1 sm:min-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === "" ? "All statuses" : s}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {p === "" ? "All priorities" : p}
          </option>
        ))}
      </select>

      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}