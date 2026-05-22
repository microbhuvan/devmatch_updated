import dotenv from "dotenv";
dotenv.config();

import express, {Request, Response} from "express";
import authRouter from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req:Request, res:Response )=>{
    res.send("hello from server");
})

app.listen(PORT, ()=>{
    console.log("server started");
})