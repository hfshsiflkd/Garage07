import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function deleteItemById(req: Request, res: Response) {
  const { category, itemId } = req.params;

  const menuCategory = await Menu.findOne({ category });
  if (!menuCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const item = menuCategory.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.deleteOne(); // subdocument remove
  await menuCategory.save();

  return res.json({ message: "Item deleted", itemId });
}
