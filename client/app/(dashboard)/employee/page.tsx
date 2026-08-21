"use client"
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";
import { TicketList } from "@/components/tickets/TicketList";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EmployeeDashboard() {

  const [showForm, setShowForm] = useState(false);
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
       <DashboardLayout>
       <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-900">My Tickets</h1>
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "New Ticket"}
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-5 border border-slate-200 rounded-lg bg-white">
            <CreateTicketForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        <TicketList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}