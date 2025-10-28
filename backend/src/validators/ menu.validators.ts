import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const moneyToNumber = z.preprocess((v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.-]/g, ""));
    return Number.isNaN(n) ? v : n;
  }
  return v;
}, z.number().nonnegative({ message: "price must be a non-negative number" }));

export const createCategorySchema = z.object({
  body: z.object({
    category: z.string().min(1, "category is required").trim(),
    // сонголтоор урьдчилж default болгох боломж олгов
    isDefault: z.boolean().optional(),
    items: z
      .array(
        z.object({
          name: z.string().min(1).trim(),
          price: moneyToNumber,
          desc: z.string().optional().default(""),
          img: z.string().url().optional(),
          available: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

export const addItemSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
  }),
  body: z.object({
    name: z.string().min(1).trim(),
    price: moneyToNumber,
    desc: z.string().optional().default(""),
    img: z.string().url().optional(),
  }),
});

export const itemIdParamSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
    itemId: objectId,
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
    itemId: objectId,
  }),
  body: z.object({
    name: z.string().min(1).trim().optional(),
    price: moneyToNumber.optional(),
    desc: z.string().optional(),
    img: z.string().url().optional(),
    available: z.boolean().optional(),
    removeImage: z.boolean().optional(),
  }),
});

export const renameCategoryParamsSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
  }),
});

export const renameCategoryBodySchema = z.object({
  body: z.object({
    newCategory: z.string().min(1, "newCategory is required").trim(),
  }),
});

// NEW: reorder
export const reorderSchema = z.object({
  body: z.object({
    ids: z.array(objectId).min(1),
  }),
});

// NEW: default toggle
export const defaultToggleSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ isDefault: z.boolean() }),
});
export const setPositionSchema = z.object({
  params: z.object({ id: objectId }), // :id бол ObjectId
  body: z.object({ position: z.number().int().nonnegative() }), // 0..N
});


