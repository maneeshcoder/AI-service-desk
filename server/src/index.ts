import dotenv from "dotenv";
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./sockets";

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initSocket(httpServer);

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};



startServer();