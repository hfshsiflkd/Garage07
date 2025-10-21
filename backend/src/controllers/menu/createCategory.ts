import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function createCategory(req: Request, res: Response) {
  const { category, items } = req.body;

  const exists = await Menu.findOne({ category });
  if (exists) {
    return res.status(409).json({ message: "Category already exists" });
  }

  const doc = await Menu.create({
    category,
    items: items || [],
  });

  return res.status(201).json(doc);
}
