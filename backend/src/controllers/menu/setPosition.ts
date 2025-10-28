import { Request, Response } from "express";
import Menu from "../../models/menu";

/**
 * PATCH /api/menu/:id/position
 * Body: { position: number }
 * - oldPos -> newPos руу зөөхөд бусдыг шатаар шилжүүлнэ
 */
export default async function setPosition(req: Request, res: Response) {
  const { id } = req.params;
  const { position } = req.body as { position: number };

  if (!Number.isInteger(position) || position < 0) {
    return res
      .status(400)
      .json({ message: "position must be a non-negative integer" });
  }

  const doc = await Menu.findById(id).lean();
  if (!doc) return res.status(404).json({ message: "Category not found" });

  const oldPos = doc.position;
  const newPos = position;

  if (newPos === oldPos) {
    const list = await Menu.find()
      .sort({ isDefault: -1, position: 1, createdAt: 1 })
      .lean();
    return res.json({ ok: true, list });
  }

  // Хязгаар шалгах — хамгийн их боломжит position
  const maxPosDoc = await Menu.findOne().sort({ position: -1 }).lean();
  const maxPos = maxPosDoc?.position ?? 0;
  const safeNewPos = Math.min(newPos, maxPos);

  // Диапазон $inc — энгийн логик
  if (safeNewPos < oldPos) {
    // дээш зөөлгөх: [safeNewPos, oldPos-1] бүгд +1
    await Menu.updateMany(
      { position: { $gte: safeNewPos, $lt: oldPos } },
      { $inc: { position: 1 } }
    );
  } else {
    // доош зөөлгөх: (oldPos, safeNewPos] бүгд -1
    await Menu.updateMany(
      { position: { $gt: oldPos, $lte: safeNewPos } },
      { $inc: { position: -1 } }
    );
  }

  // Өөрийг нь шинэ байрлалд тавина
  await Menu.updateOne({ _id: id }, { $set: { position: safeNewPos } });

  const list = await Menu.find()
    .sort({ isDefault: -1, position: 1, createdAt: 1 })
    .lean();
  return res.json({ ok: true, list });
}
