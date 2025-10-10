import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB холболт
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 TypeScript backend is running!");
});

// Routes


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
