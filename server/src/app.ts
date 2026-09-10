import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

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

export default app;