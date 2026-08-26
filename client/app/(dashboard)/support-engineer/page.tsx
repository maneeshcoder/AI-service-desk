"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketList } from "@/components/tickets/TicketList";

export default function SupportEngineerDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [order, setOrder] = useState("desc");
    const SUPPORT_ROLES = ["support-engineer"] as const;

  return (
    <ProtectedRoute allowedRoles={SUPPORT_ROLES}>
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

        <TicketList filters={{ search, status, priority, order }} basePath="/support-engineer" />
      </DashboardLayout>
    </ProtectedRoute>
  );
}