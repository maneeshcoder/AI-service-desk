"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useAnalytics } from "@/hooks/useAnalytics";

const ADMIN_ROLES = ["admin"] as const;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <DashboardLayout>
          <p className="text-sm text-slate-500">Loading analytics…</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const statusData = Object.entries(data.byStatus).map(([status, count]) => ({ status, count }));
  const categoryData = Object.entries(data.byCategory).map(([category, count]) => ({ category, count }));

  return (
    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
      <DashboardLayout>
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Tickets" value={data.totalTickets} />
          <StatCard label="Open" value={data.byStatus.open ?? 0} />
          <StatCard label="Resolved" value={data.byStatus.resolved ?? 0} />
          <StatCard label="Avg Resolution" value={`${data.avgResolutionHours}h`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm font-medium text-slate-700 mb-4">Tickets — last 14 days</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm font-medium text-slate-700 mb-4">Tickets by category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}