import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function getAll(_req: Request, res: Response) {
  try {
    const list = await Menu.find()
      .sort({ isDefault: -1, position: 1, createdAt: 1 })
      .lean();
    res.json({ list });
  } catch (error: any) {
    console.error("getAll error:", error.message);
    return res.status(500).json({ message: "Failed to fetch menus" });
  }
}
