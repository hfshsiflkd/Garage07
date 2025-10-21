import { Request, Response } from "express";
import Menu from "../../models/menu";
import { Types } from "mongoose";

export default async function addItem(req: Request, res: Response) {
  const { category } = req.params;
  const { name, price, desc, img } = req.body;

  const menuCategory = await Menu.findOne({ category });
  if (!menuCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const newItem = {
    _id: new Types.ObjectId(),
    name,
    price,
    desc: desc || "",
    img: img || "",
    available: true,
  };

  menuCategory.items.push(newItem as any);
  await menuCategory.save();

  // зөвхөн шинээр үүсгэсэн item-г буцааж өгье
  return res
    .status(201)
    .json({ item: newItem, category: menuCategory.category });
}
