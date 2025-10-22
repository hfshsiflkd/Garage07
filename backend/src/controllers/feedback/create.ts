import { Request, Response } from "express";
import Feedback from "../../models/feedback";
import { sendFeedbackMail } from "../../utils/mailer";

export default async function createFeedback(req: Request, res: Response) {
  const { name, message } = req.body;

  // зөөлөн цэвэрлэгээ
  const clean = (s?: string) =>
    typeof s === "string" ? s.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() : s;

  const doc = await Feedback.create({
    name: clean(name)!,
    message: clean(message)!,
    userAgent: req.get("user-agent") || "",
    ip: (req.headers["x-forwarded-for"] as string) || req.ip || "",
  });

  // Мэйл илгээх (алдаа гарсан ч хэрэглэгчид 201 буцаана)
  try {
    await sendFeedbackMail({
      name: doc.name,
      email: "",
      message: doc.message,
    });
  } catch (e) {
    console.warn("⚠️ Feedback email failed:", e);
  }

  return res.status(201).json({
    message: "Санал хүсэлтийг хүлээн авлаа, баярлалаа!",
    feedbackId: doc._id,
  });
}
