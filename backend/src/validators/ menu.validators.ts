import { z } from "zod";

// 24 тэмдэгттэй hex ObjectId шалгагч
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// "₮10,000" зэрэг текстийг тоо болгон хөрвүүлэх
const moneyToNumber = z.preprocess((v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.-]/g, ""));
    return Number.isNaN(n) ? v : n;
  }
  return v;
}, z.number().nonnegative({ message: "price must be a non-negative number" }));

/** ------------------------
 *  Category: CREATE
 *  ------------------------ */
export const createCategorySchema = z.object({
  body: z.object({
    category: z.string().min(1, "category is required").trim(),
    items: z
      .array(
        z.object({
          name: z.string().min(1).trim(),
          price: moneyToNumber, // seed хийх үед шаардлагатай
          desc: z.string().optional().default(""),
          img: z.string().url().optional(),
          available: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

/** ------------------------
 *  Item: ADD (price REQUIRED)
 *  ------------------------ */
export const addItemSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
  }),
  body: z.object({
    name: z.string().min(1).trim(),
    price: moneyToNumber, // ⬅️ ЗААВАЛ
    desc: z.string().optional().default(""),
    img: z.string().url().optional(),
  }),
});

/** ------------------------
 *  Common: params with itemId
 *  ------------------------ */
export const itemIdParamSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
    itemId: objectId,
  }),
});

/** ------------------------
 *  Item: UPDATE (partial)
 *  removeImage дэмжинэ
 *  ------------------------ */
export const updateItemSchema = z.object({
  params: z.object({
    category: z.string().min(1).trim(),
    itemId: objectId,
  }),
  body: z.object({
    name: z.string().min(1).trim().optional(),
    price: moneyToNumber.optional(), // ⬅️ partial update тул optional
    desc: z.string().optional(),
    img: z.string().url().optional(), // шинэ зураг URL
    available: z.boolean().optional(),
    removeImage: z.boolean().optional(), // ⬅️ зураг устгах урсгал
  }),
});

/** ------------------------
 *  Category: RENAME
 *  ------------------------ */
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
