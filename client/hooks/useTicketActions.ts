import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useUpdateStatus(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: string) => {
      const { data } = await api.patch(`/tickets/${ticketId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketHistory", ticketId] });
    },
  });
}

export function useAssignTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (engineerId: string) => {
      const { data } = await api.patch(`/tickets/${ticketId}/assign`, { engineerId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketHistory", ticketId] });
    },
  });
}