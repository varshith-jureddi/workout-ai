import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { planRouter } from "./routes/plan";

dotenv.config();

const app=express();
const PORT = 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());


// api routes
app.use("/api/plan",planRouter);

app.listen(PORT, () => {
    console.log("port running on ",PORT);
})