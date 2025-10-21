import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function deleteCategory(req: Request, res: Response) {
  const { category } = req.params;
  const deleted = await Menu.findOneAndDelete({ category });
  if (!deleted) {
    return res.status(404).json({ message: "Category not found" });
  }
  return res.json({ message: `${category} deleted successfully` });
}
