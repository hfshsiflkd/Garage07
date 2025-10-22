import { z } from "zod";

export const createFeedbackSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Нэр шаардлагатай").max(80),
    message: z.string().trim().min(1, "Санал хоосон байна").max(2000),
  }),
});

export const listFeedbackQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  }),
});
