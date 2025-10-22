import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function renameCategory(req: Request, res: Response) {
  const { category } = req.params;
  const { newCategory } = req.body as { newCategory: string };

  const doc = await Menu.findOne({ category });
  if (!doc) return res.status(404).json({ message: "Category not found" });

  const exists = await Menu.findOne({ category: newCategory });
  if (exists)
    return res.status(409).json({ message: "Category already exists" });

  doc.category = newCategory.trim();
  await doc.save();

  return res.json({ message: "Category renamed", category: doc });
}
