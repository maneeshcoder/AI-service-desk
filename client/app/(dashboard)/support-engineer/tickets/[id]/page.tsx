"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useTicket } from "@/hooks/useTicket";
import { useComments, useAddComment } from "@/hooks/useComments";
import { useAssignableEngineers } from "@/hooks/useAssignableEngineers";
import { useUpdateStatus, useAssignTicket } from "@/hooks/useTicketActions";
import { TicketTimeline } from "@/components/tickets/TicketTimeline";
import { SuggestedSolution } from "@/components/tickets/SuggestedSolution";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types";

const STATUS_OPTIONS: Ticket["status"][] = ["open", "in-progress", "resolved", "closed"];

export default function SupportTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id);
  const { data: comments } = useComments(id);
  const { data: engineers } = useAssignableEngineers();
  const addComment = useAddComment(id);
  const updateStatus = useUpdateStatus(id);
  const assignTicket = useAssignTicket(id);
  const [message, setMessage] = useState("");
  const SUPPORT_ROLES = ["support-engineer"] as const;

  async function handleSend() {
    if (!message.trim()) return;
    await addComment.mutateAsync(message);
    setMessage("");
  }

  if (isLoading || !ticket) {
    return (
      <ProtectedRoute allowedRoles={SUPPORT_ROLES}>
        <DashboardLayout>
          <p className="text-sm text-slate-500">Loading…</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const currentAssigneeId =
    typeof ticket.assignedTo === "object" ? ticket.assignedTo?._id : ticket.assignedTo;

  return (
    <ProtectedRoute allowedRoles={["support-engineer"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{ticket.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{ticket.description}</p>
            </div>

            <select
              value={ticket.status}
              onChange={(e) => updateStatus.mutate(e.target.value)}
              disabled={updateStatus.isPending}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-slate-500">Assigned to:</span>
            <select
              value={currentAssigneeId ?? ""}
              onChange={(e) => assignTicket.mutate(e.target.value)}
              disabled={assignTicket.isPending}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Unassigned</option>
              {engineers?.map((eng) => (
                <option key={eng._id} value={eng._id}>{eng.name}</option>
              ))}
            </select>
          </div>

         
          {ticket.aiSummary && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-5 py-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-700">AI Summary</p>
              </div>
              <p className="text-sm text-slate-700">{ticket.aiSummary}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-slate-500 capitalize">Category: {ticket.category}</span>
                <span className="text-xs text-slate-500 capitalize">Priority: {ticket.priority}</span>
              </div>
            </div>
          )}

          <SuggestedSolution ticketId={id} />

          <TicketTimeline ticketId={id} />

          <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-200">
            {comments?.length ? (
              comments.map((c) => (
                <div key={c._id} className="px-5 py-3">
                  <p className="text-xs font-medium text-slate-700">{c.author.name}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{c.message}</p>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">No comments yet.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 ">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={addComment.isPending}>
              Send
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}