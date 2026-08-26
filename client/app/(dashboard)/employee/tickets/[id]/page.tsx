"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useTicket } from "@/hooks/useTicket";
import { useComments, useAddComment } from "@/hooks/useComments";
import { TicketTimeline } from "@/components/tickets/TicketTimeline";
import { Button } from "@/components/ui/button";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id);
  const { data: comments } = useComments(id);
  const addComment = useAddComment(id);
  const [message, setMessage] = useState("");
 const EMPLOYEE = ["employee"] as const;

  async function handleSend() {
    if (!message.trim()) return;
    await addComment.mutateAsync(message);
    setMessage("");
  }

  if (isLoading || !ticket) {
    return (
      <ProtectedRoute allowedRoles={EMPLOYEE}>
        <DashboardLayout>
          <p className="text-sm text-slate-500">Loading…</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{ticket.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{ticket.description}</p>
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

          <div className="flex flex-col sm:flex-row gap-2">
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