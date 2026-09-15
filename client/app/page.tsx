"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  employee: "/employee",
  "support-engineer": "/support-engineer",
  admin: "/admin",
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    router.replace(DASHBOARD_BY_ROLE[user.role] ?? "/login");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  );
}