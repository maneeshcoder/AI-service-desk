import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface Comment {
  _id: string;
  message: string;
  author: { _id: string; name: string; role: string };
  createdAt: string;
}

export function useComments(ticketId: string) {
  return useQuery<Comment[]>({
    queryKey: ["comments", ticketId],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}/comments`);
      return data;
    },
  });
}

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post(`/tickets/${ticketId}/comments`, { message });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
    },
  });
}