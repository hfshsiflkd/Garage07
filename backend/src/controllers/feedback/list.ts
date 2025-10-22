import { Request, Response } from "express";
import Feedback from "../../models/feedback";

/**
 * GET /api/feedback
 * Санал хүсэлтүүдийг хуудасласан байдлаар буцаана.
 * Query: ?page=1&limit=20
 */
export default async function listFeedback(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 20;
    const skip = (page - 1) * limit;

    // feedback-үүдийг createdAt буурахаар эрэмбэлнэ
    const [items, total] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (error) {
    console.error("❌ Error fetching feedback list:", error);
    return res.status(500).json({ message: "Error fetching feedback list" });
  }
}
