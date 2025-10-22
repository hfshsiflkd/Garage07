import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import menuRoutes from "./routes/menu.routes";
import uploadRouter from "./routes/upload";
import { connectDB } from "./config/DB";
import feedbackRoutes from "./routes/feedback.routes";

// 🌱 Орчны хувьсагчийг ачаалах
dotenv.config();

// 🚀 Express апп үүсгэх
const app: Application = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 🧠 MongoDB холболт
connectDB();

// 🔍 Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 TypeScript backend is running!");
});

// 📦 Routes
app.use("/api/menu", menuRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/feedback", feedbackRoutes);

// ⚙️ Алдааны баригч middleware (хэрэв байгаа бол)
import { errorMiddleware } from "./middlewares/error.middleware";
app.use(errorMiddleware);

// 🟢 Сервер ажиллуулах
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
