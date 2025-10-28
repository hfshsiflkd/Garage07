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

    // NEW
    position: { type: Number, default: 0, index: true },
    isDefault: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// зөвхөн isDefault=true бичлэгүүд дээр unique батална
MenuSchema.index(
  { isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

export default model("Menu", MenuSchema);
