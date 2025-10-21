import { Schema, model, Types } from "mongoose";

const MenuItemSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }, 
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    desc: { type: String, default: "" },
    img: { type: String, default: "" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

const MenuSchema = new Schema(
  {
    category: { type: String, required: true, unique: true, trim: true },
    items: { type: [MenuItemSchema], default: [] },
  },
  { timestamps: true }
);

export default model("Menu", MenuSchema);
