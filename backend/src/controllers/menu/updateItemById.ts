import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function updateItemById(req: Request, res: Response) {
  const { category, itemId } = req.params;
  const { name, price, desc, img, available } = req.body;

  const menuCategory = await Menu.findOne({ category });
  if (!menuCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const item: any = menuCategory.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (name !== undefined) item.name = name;
  if (price !== undefined) item.price = price;
  if (desc !== undefined) item.desc = desc;
  if (img !== undefined) item.img = img;
  if (available !== undefined) item.available = available;

  await menuCategory.save();

  return res.json({ message: "Item updated", item });
}
