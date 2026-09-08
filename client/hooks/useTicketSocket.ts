import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

export function useTicketSocket(ticketId: string) {
   console.log("🔥 useTicketSocket CALLED:", ticketId);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    socket.emit("join-ticket", ticketId);

    function handleStatusUpdate() {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticketHistory", ticketId] });
    }

    function handleNewComment() {
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
    }

    socket.on("status-updated", handleStatusUpdate);
    socket.on("assignment-updated", handleStatusUpdate);
    socket.on("new-comment", handleNewComment);

    return () => {
      socket.emit("leave-ticket", ticketId);
      socket.off("status-updated", handleStatusUpdate);
      socket.off("assignment-updated", handleStatusUpdate);
      socket.off("new-comment", handleNewComment);
    };
  }, [ticketId, queryClient]);
}