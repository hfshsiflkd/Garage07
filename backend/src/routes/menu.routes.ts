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
} from "../validators/ menu.validators";

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

const router = Router();

// Бүх category + items
router.get("/", asyncHandler(getAll));

// Category үүсгэх
router.post("/", validate(createCategorySchema), asyncHandler(createCategory));

// Item нэмэх (ID автоматаар үүснэ)
router.post("/:category/items", validate(addItemSchema), asyncHandler(addItem));

// Item авах (ID-гаар)
router.get(
  "/:category/items/:itemId",
  validate(itemIdParamSchema),
  asyncHandler(getItemById)
);

// Item шинэчлэх (ID-гаар)
router.put(
  "/:category/items/:itemId",
  validate(updateItemSchema),
  asyncHandler(updateItemById)
);

// Item availability toggle (ID-гаар)
router.put(
  "/:category/items/:itemId/availability",
  validate(itemIdParamSchema),
  asyncHandler(toggleAvailabilityById)
);

// Item устгах (ID-гаар)
router.delete(
  "/:category/items/:itemId",
  validate(itemIdParamSchema),
  asyncHandler(deleteItemById)
);

router.put(
  "/:category",
  validate(renameCategoryParamsSchema),
  validate(renameCategoryBodySchema),
  asyncHandler(renameCategory)
);

// Category устгах
router.delete("/:category", asyncHandler(deleteCategory));

export default router;
