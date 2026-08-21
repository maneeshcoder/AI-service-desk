import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>{/* admin dashboard content */}</div>
    </ProtectedRoute>
  );
}