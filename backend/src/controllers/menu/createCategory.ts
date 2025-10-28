import { Request, Response } from "express";
import Menu from "../../models/menu";

/**
 * Body:
 *  - category: string (unique)
 *  - items?: []
 *  - position?: number  (сонголтоор — өгвөл тухайн байрлалд insert)
 */
export default async function createCategory(req: Request, res: Response) {
  const {
    category,
    items = [],
    position,
  } = req.body as {
    category: string;
    items?: any[];
    position?: number;
  };

  const exists = await Menu.findOne({ category }).lean();
  if (exists)
    return res.status(409).json({ message: "Category already exists" });

  // Хамгийн сүүлчийн position олно
  const last = await Menu.findOne().sort({ position: -1 }).lean();
  const lastPos = last?.position ?? -1;

  let targetPos: number;
  if (Number.isInteger(position) && (position as number) >= 0) {
    // insert at requested position
    targetPos = Math.min(position as number, lastPos + 1);
    // targetPos болон түүнээс дээш бүхний position-ыг +1 болгож зай гаргана
    await Menu.updateMany(
      { position: { $gte: targetPos } },
      { $inc: { position: 1 } }
    );
  } else {
    // сүүлд нэмэх
    targetPos = lastPos + 1;
  }

  const doc = await Menu.create({
    category,
    items,
    position: targetPos,
    isDefault: false,
  });

  return res.status(201).json(doc);
}
