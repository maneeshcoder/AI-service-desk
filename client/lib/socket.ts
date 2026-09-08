import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

   const url = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");


  socket = io(url, {
    auth: { token },
  });

  
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}