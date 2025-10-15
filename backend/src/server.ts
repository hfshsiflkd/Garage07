import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes";
import { connectDB } from "./config/DB";

import uploadRouter from "./routes/upload";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 TypeScript backend is running!");
});

app.use("/api/menu", menuRoutes);
app.use("/api/upload", uploadRouter);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
