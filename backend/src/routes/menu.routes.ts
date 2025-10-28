import { Router } from "express";
import { validate } from "../middlewares/error.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCategorySchema,
  addItemSchema,
  updateItemSchema,
  itemIdParamSchema,
  renameCategoryParamsSchema,
  renameCategoryBodySchema,
  // 🆕 байрлал солихын валидаци
  setPositionSchema,
  // 🆕 default toggle-ийн валидаци
  defaultToggleSchema,
} from "../validators/ menu.validators"; // ⬅️ ЗАЙГ АРИЛГАСАН

import {
  getAll,
  createCategory,
  addItem,
  getItemById,
  updateItemById,
  toggleAvailabilityById,
  deleteItemById,
  deleteCategory,
  renameCategory,
} from "../controllers/menu/ index";

// 🆕 шинэ контроллерууд
import setPosition from "../controllers/menu/setPosition";
import setDefaultCategory from "../controllers/menu/setDefaultCategory";

const router = Router();

// Бүх category + items (sorted)
router.get("/", asyncHandler(getAll));

// Category үүсгэх
router.post("/", validate(createCategorySchema), asyncHandler(createCategory));

// Item нэмэх
router.post("/:category/items", validate(addItemSchema), asyncHandler(addItem));

// Item авах
router.get(
  "/:category/items/:itemId",
  validate(itemIdParamSchema),
  asyncHandler(getItemById)
);

// Item шинэчлэх
router.put(
  "/:category/items/:itemId",
  validate(updateItemSchema),
  asyncHandler(updateItemById)
);

// Item availability toggle
router.put(
  "/:category/items/:itemId/availability",
  validate(itemIdParamSchema),
  asyncHandler(toggleAvailabilityById)
);

// Item устгах
router.delete(
  "/:category/items/:itemId",
  validate(itemIdParamSchema),
  asyncHandler(deleteItemById)
);

// Category rename
router.put(
  "/:category",
  validate(renameCategoryParamsSchema),
  validate(renameCategoryBodySchema),
  asyncHandler(renameCategory)
);

// Category устгах
router.delete("/:category", asyncHandler(deleteCategory));

// 🆕 Категорийн байрлал солих (энгийн логик: $inc диапазон)
router.patch(
  "/:id/position",
  validate(setPositionSchema),
  asyncHandler(setPosition)
);

// 🆕 Нэгийг default болгох/болих (partial unique индекстэй таарна)
router.patch(
  "/:id/default",
  validate(defaultToggleSchema),
  asyncHandler(setDefaultCategory)
);

export default router;
