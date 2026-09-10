import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface DashboardStats {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgResolutionHours: number;
  trend: { date: string; count: number }[];
}

export function useAnalytics() {
  return useQuery<DashboardStats>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await api.get("/analytics/dashboard");
      return data;
    },
    staleTime: 5 * 60 * 1000, // analytics don't need to be second-by-second fresh
  });
}