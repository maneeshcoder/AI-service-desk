import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import routes from "./routes/index.routes";
import { errorHandler } from "./middlewares/error.middleware";
import http from "http";
import { initSocket } from "./sockets";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
initSocket(httpServer);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use("/api", routes);
app.use(errorHandler); 
const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();