"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUpdateUserRole } from "@/hooks/useUsers";

const ADMIN_ROLES = ["admin"] as const;
const ROLE_OPTIONS = ["employee", "support-engineer", "admin"] as const;

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(userId: string, role: string) {
    setError(null);
    try {
      await updateRole.mutateAsync({ userId, role });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update role");
    }
  }

  return (
    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
      <DashboardLayout>
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Users</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <div className="border border-slate-200 rounded-lg bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-medium text-slate-500">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Role</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?.id || updateRole.isPending}
                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}