"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { useSuggestedSolution } from "@/hooks/useSuggestedSolution";
import { Button } from "@/components/ui/button";

export function SuggestedSolution({ ticketId }: { ticketId: string }) {
  const [requested, setRequested] = useState(false);
  const { data, isLoading, isError } = useSuggestedSolution(ticketId, requested);

  if (!requested) {
    return (
      <Button variant="outline" onClick={() => setRequested(true)} className="gap-2">
        <Lightbulb className="h-4 w-4" />
        Get AI suggestions
      </Button>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Thinking through this one…</p>;
  }

  if (isError || !data?.steps.length) {
    return <p className="text-sm text-slate-500">No suggestions available for this ticket.</p>;
  }

  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
        <p className="text-xs font-medium uppercase tracking-wider text-amber-700">Suggested approach</p>
      </div>
      <ol className="space-y-1.5 list-decimal list-inside">
        {data.steps.map((step, i) => (
          <li key={i} className="text-sm text-slate-700">
            {step}
          </li>
        ))}
      </ol>
      {data.reasoning && <p className="text-xs text-slate-500 mt-2 italic">{data.reasoning}</p>}
    </div>
  );
}