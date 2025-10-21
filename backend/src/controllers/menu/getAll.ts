import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function getAll(_req: Request, res: Response) {
  const menus = await Menu.find().lean();
  return res.json(menus);
}
