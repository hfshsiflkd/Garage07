import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function setDefaultCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { isDefault } = req.body as { isDefault: boolean };

  if (isDefault) {
    await Menu.updateMany({ isDefault: true }, { $set: { isDefault: false } });
    await Menu.findByIdAndUpdate(id, {
      $set: { isDefault: true, position: 0 },
    });
  } else {
    await Menu.findByIdAndUpdate(id, { $set: { isDefault: false } });
  }

  const list = await Menu.find()
    .sort({ isDefault: -1, position: 1, createdAt: 1 })
    .lean();
  res.json({ ok: true, list });
}
