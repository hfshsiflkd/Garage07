import express, { Request, Response } from "express";
import Menu from "../models/menu";

const router = express.Router();

// 🟢 1. Бүх цэсийг авах
router.get("/", async (req: Request, res: Response) => {
  console.log("🔥 GET /api/menu called");
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    console.error("❌ Error fetching menu:", error);
    res.status(500).json({ message: "Error fetching menu data" });
  }
});

// 🟡 2. Шинэ category нэмэх
router.post("/", async (req: Request, res: Response) => {
  try {
    const { category, items } = req.body;

    const newCategory = new Menu({
      category,
      items: items || [],
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(400).json({ message: "Error adding category" });
  }
});

// 🟣 3. Нэг category-д шинэ хоол (item) нэмэх
router.post("/:category/items", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { name, price, desc, img } = req.body;

    const menuCategory = await Menu.findOne({ category });
    if (!menuCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    menuCategory.items.push({ name, price, desc, img , available: true });
    await menuCategory.save();

    res.status(201).json(menuCategory);
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(400).json({ message: "Error adding item" });
  }
});

// 🔵 4. Category устгах
router.delete("/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const deleted = await Menu.findOneAndDelete({ category });
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: `${category} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

// 🔴 5. Item устгах
router.delete(
  "/:category/items/:itemName",
  async (req: Request, res: Response) => {
    try {
      const { category, itemName } = req.params;
      const menuCategory = await Menu.findOne({ category });
      if (!menuCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      menuCategory.items = menuCategory.items.filter(
        (i) => i.name !== itemName
      );
      await menuCategory.save();

      res.json({ message: `${itemName} removed from ${category}` });
    } catch (error) {
      res.status(500).json({ message: "Error deleting item" });
    }
  }
);

router.put(
  "/:category/items/:itemName/availability",
  async (req: Request, res: Response) => {
    try {
      const { category, itemName } = req.params;

      const menuCategory = await Menu.findOne({ category });
      if (!menuCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const item = menuCategory.items.find((i) => i.name === itemName);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      item.available = !item.available;
      await menuCategory.save();

      res.json({
        message: `${itemName} is now ${
          item.available ? "available" : "unavailable"
        }`,
        updatedItem: item,
      });
    } catch (error) {
      console.error("❌ Error toggling item availability:", error);
      res.status(500).json({ message: "Error updating availability" });
    }
  }
);

// 🟢 6. Item update хийх
router.put("/:category/items/:itemName", async (req: Request, res: Response) => {
  try {
    const { category, itemName } = req.params;
    const { name, price, desc, img } = req.body;

    const menuCategory = await Menu.findOne({ category });
    if (!menuCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = menuCategory.items.find((i) => i.name === itemName);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🧩 талбаруудыг шинэчлэх
    if (name) item.name = name;
    if (price) item.price = price;
    if (desc) item.desc = desc;
    if (img) item.img = img;

    await menuCategory.save();

    res.json({
      message: `${itemName} updated successfully`,
      updatedItem: item,
    });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

export default router;
