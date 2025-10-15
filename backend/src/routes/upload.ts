import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ Multer storage (энд өмнө алдаа гарч байсан)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "menu_images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  } as any,
});

// ✅ Upload middleware
const upload = multer({ storage });

// ✅ Upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file as any;
    console.log("✅ Uploaded to Cloudinary:", file.path);
    res.json({ url: file.path });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
