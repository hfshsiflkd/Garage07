import { Request, Response } from "express";
import Menu from "../../models/menu";

// Ашиглах жижиг туслах: "₮10,000" → 10000
function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.-]/g, ""));
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

export default async function updateItemById(req: Request, res: Response) {
  const { category, itemId } = req.params;
  const { name, price, desc, img, available, removeImage } = req.body as {
    name?: string;
    price?: number | string;
    desc?: string;
    img?: string;
    available?: boolean;
    removeImage?: boolean;
  };

  const menuCategory = await Menu.findOne({ category });
  if (!menuCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const item: any = menuCategory.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  // 🔤 Текст талбарууд
  if (typeof name !== "undefined") item.name = name;
  if (typeof desc !== "undefined") item.desc = desc;

  // 💰 Үнэ (стринг байж болно → тоо руу хөрвүүлнэ)
  if (typeof price !== "undefined") {
    const p = toNumber(price);
    if (typeof p === "undefined" || p < 0) {
      return res.status(400).json({ message: "Invalid price" });
    }
    item.price = p;
  }

  // ✅ Зурагны 3 горим
  if (removeImage === true) {
    item.img = "";
  } else if (typeof img === "string") {
    // шинэ зураг ирсэн бол солих
    item.img = img.trim();
  }
  // img ирээгүй, removeImage != true → хуучин зураг хэвээр

  // ✔️ Бэлэн/дууссан
  if (typeof available !== "undefined") {
    item.available = !!available;
  }

  await menuCategory.save();

  return res.json({
    message: "Item updated",
    item,
  });
}
