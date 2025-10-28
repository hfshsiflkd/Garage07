import { Request, Response } from "express";
import Menu from "../../models/menu";

export default async function deleteCategory(req: Request, res: Response) {
  const { category } = req.params;

  const toDelete = await Menu.findOne({ category }).lean();
  if (!toDelete) return res.status(404).json({ message: "Category not found" });

  // Хэрэв default бол устгахыг хориглох (хүсвэл тайлбарласан guard)
  if (toDelete.isDefault) {
    return res
      .status(409)
      .json({
        message:
          "Default category cannot be deleted. Please set another default first.",
      });
  }

  await Menu.deleteOne({ _id: toDelete._id });

  // Устгасан байрлалаас дээших бүхнийг -1 болгож шахна
  await Menu.updateMany(
    { position: { $gt: toDelete.position } },
    { $inc: { position: -1 } }
  );

  return res.json({ ok: true });
}
