import { z } from "zod";

// 24 тэмдэгттэй hex ObjectId шалгагч
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const moneyToNumber = z.preprocess((v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v.replace(/[^\d.-]/g, ""));
  return v;
}, z.number().nonnegative({ message: "price must be a non-negative number" }));

export const createCategorySchema = z.object({
  body: z.object({
    category: z.string().min(1, "category is required"),
    items: z
      .array(
        z.object({
          name: z.string().min(1),
          price: moneyToNumber,
          desc: z.string().optional(),
          img: z.string().url().optional(),
          available: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

export const addItemSchema = z.object({
  params: z.object({
    category: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1),
    price: moneyToNumber.optional(),
    desc: z.string().optional(),
    img: z.string().url().optional(),
  }),
});

export const itemIdParamSchema = z.object({
  params: z.object({
    category: z.string().min(1),
    itemId: objectId,
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    category: z.string().min(1),
    itemId: objectId,
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    price: moneyToNumber,
    desc: z.string().optional(),
    img: z.string().url().optional(),
    available: z.boolean().optional(),
  }),
});
