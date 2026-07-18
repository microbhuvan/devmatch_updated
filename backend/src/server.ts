import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {
  AppServer,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socket";
import { initializeSocket } from "./socket";
import chatRouter from "./routes/chat.route";
import connectDB from "./config/db";
import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import requestRouter from "./routes/request.route";
import feedRouter from "./routes/feed.route";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io: AppServer = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initializeSocket(io);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("hello from server");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/feed", feedRouter);
app.use("/chat", chatRouter);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("error starting server ", err.message);
  });
