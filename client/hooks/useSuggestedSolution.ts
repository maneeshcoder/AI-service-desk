import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface Suggestion {
  steps: string[];
  reasoning: string;
}

export function useSuggestedSolution(ticketId: string, enabled: boolean) {
  return useQuery<Suggestion>({
    queryKey: ["suggestion", ticketId],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}/suggestion`);
      return data;
    },
    enabled,
    staleTime: Infinity, // never auto-refetch — see note below
  });
}