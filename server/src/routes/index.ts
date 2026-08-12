import { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = Express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:3000 — never "*" with credentials
    credentials: true,
  })
);