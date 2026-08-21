import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Ticket } from "@/types";

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await api.get("/tickets");
      return data;
    },
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