
"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketList } from "@/components/tickets/TicketList";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";
import { Button } from "@/components/ui/button";

export default function EmployeeDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [order, setOrder] = useState("desc");
  const EMPLOYEE = ["employee"] as const;

  return (
    <ProtectedRoute allowedRoles={EMPLOYEE}>
      <DashboardLayout>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-xl font-semibold text-slate-900">My Tickets</h1>
          <Button onClick={() => setShowForm((s) => !s)} className="w-full sm:w-auto">
            {showForm ? "Cancel" : "New Ticket"}
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-5 border border-slate-200 rounded-lg bg-white">
            <CreateTicketForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

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

        <TicketList filters={{ search, status, priority, order }} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}