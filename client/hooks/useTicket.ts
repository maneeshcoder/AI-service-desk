import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Ticket } from "@/types";


interface TicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: string;
}

export function useTickets(filters: TicketFilters = {}) {
  return useQuery<Ticket[]>({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const { data } = await api.get("/tickets", { params: filters });
      return data;
    },
  });
}
export function useTicket(ticketId: string) {
  return useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}`);
      return data;
    },
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; description: string }) => {
      const { data } = await api.post("/tickets", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}