import { Server as HTTPServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.util";

let io: SocketServer;

export function initSocket(httpServer: HTTPServer) {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = verifyAccessToken(token);
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", (socket as any).user.userId);

    socket.on("join-ticket", (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on("leave-ticket", (ticketId: string) => {
      socket.leave(`ticket:${ticketId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", (socket as any).user.userId);
    });
  });
}

export function getIO(): SocketServer | null {
  return io;
}