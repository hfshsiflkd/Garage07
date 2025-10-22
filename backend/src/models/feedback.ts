import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model("Feedback", FeedbackSchema);
