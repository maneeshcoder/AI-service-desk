"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketList } from "@/components/tickets/TicketList";

const ADMIN_ROLES = ["admin"] as const;

export default function AdminTicketsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [order, setOrder] = useState("desc");

  return (
    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
      <DashboardLayout>
        <h1 className="text-xl font-semibold text-slate-900 mb-6">All Tickets</h1>

        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          sortOrder={order}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSortOrderChange={setOrder}
        />

        <TicketList filters={{ search, status, priority, order }} basePath="/admin" />
      </DashboardLayout>
    </ProtectedRoute>
  );
}