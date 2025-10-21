import { Request, Response } from "express";
import Menu from "../../models/menu";
import { Types } from "mongoose";

export default async function toggleAvailabilityById(
  req: Request,
  res: Response
) {
  const { category, itemId } = req.params;

  // 1) ID шалгах
  if (!Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid itemId" });
  }

  // 2) Category олох
  const menuCategory = await Menu.findOne({ category });
  if (!menuCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  // 3) Item-аа аюулгүй хайх (cast error үүсгэхгүй)
  const item: any = menuCategory.items.find(
    (i: any) => i._id?.toString() === itemId
  );
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  // 4) Toggle хийж хадгалах
  item.available = !item.available;
  await menuCategory.save();

  return res.json({
    message: `Item availability toggled to ${
      item.available ? "available" : "unavailable"
    }`,
    item,
  });
}
