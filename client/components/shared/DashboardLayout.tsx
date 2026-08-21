"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Ticket, Users, LogOut } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  employee: [
    { label: "My Tickets", href: "/employee", icon: Ticket },
  ],
  "support-engineer": [
    { label: "Dashboard", href: "/support-engineer", icon: LayoutDashboard },
    { label: "All Tickets", href: "/support-engineer/tickets", icon: Ticket },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "All Tickets", href: "/admin/tickets", icon: Ticket },
    { label: "Users", href: "/admin/users", icon: Users },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null; // ProtectedRoute already guarantees this won't render without a user

  const navItems = NAV_BY_ROLE[user.role] ?? [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-sm font-medium tracking-wide text-indigo-400">AI SERVICE DESK</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 space-y-3">
          <div className="px-3">
            <p className="text-sm font-medium text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.replace("-", " ")}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-50">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}