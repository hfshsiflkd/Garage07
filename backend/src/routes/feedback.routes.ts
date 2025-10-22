import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middlewares/error.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createFeedbackSchema,
  listFeedbackQuerySchema,
} from "../validators/feedback.validators";
import { createFeedback, listFeedback } from "../controllers/feedback";

const router = Router();

const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/",
  feedbackLimiter,
  validate(createFeedbackSchema),
  asyncHandler(createFeedback)
);

router.get("/", validate(listFeedbackQuerySchema), asyncHandler(listFeedback));

export default router;
