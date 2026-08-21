"use client";

import { useState, useEffect } from "react";
import { Headset } from "lucide-react";

const STAGES = ["Open", "In progress", "Resolved"] as const;

function TicketLifecycleIndicator() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">Ticket lifecycle</p>
      <div className="flex items-center gap-3">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-700 ${
                  i === activeStage ? "bg-indigo-400" : "bg-slate-700"
                }`}
              />
              <span className="text-xs text-slate-400">{stage}</span>
            </div>
            {i < STAGES.length - 1 && <span className="h-px w-8 bg-slate-700 -mt-5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthLayout({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-slate-100 p-12">
        <div>
          <p className="text-sm font-medium tracking-wide text-indigo-400">AI SERVICE DESK</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight max-w-sm">{heading}</h1>
        </div>
        <TicketLifecycleIndicator />
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* mobile-only brand mark — hidden on desktop where the left panel already shows it */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-10">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Headset className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-900">AI Service Desk</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}