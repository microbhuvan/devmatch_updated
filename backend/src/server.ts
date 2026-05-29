import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;

import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import connectDB from "./config/db";

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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("error starting server ", err.message);
  });
