"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! What issue are you running into?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("clarifying");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatbot/message", { sessionId, message: userMessage });
      setMessages((prev) => [...prev, { role: "assistant", text: data.message }]);
      setStage(data.stage);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket() {
    setLoading(true);
    try {
      await api.post("/chatbot/create-ticket", { sessionId });
      setMessages((prev) => [...prev, { role: "assistant", text: "I've created a ticket for you — a support engineer will follow up." }]);
      setStage("ticket_created");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[28rem] bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-900 rounded-t-lg">
        <p className="text-sm font-medium text-white">AI Assistant</p>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400">Thinking…</p>}
        <div ref={scrollRef} />
      </div>

      {stage === "unresolved" && (
        <div className="px-4 py-2 border-t border-slate-200">
          <Button onClick={handleCreateTicket} className="w-full" disabled={loading}>
            Create a ticket
          </Button>
        </div>
      )}

      {stage !== "ticket_created" && (
        <div className="flex gap-2 p-3 border-t border-slate-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your issue…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button size="icon" onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}