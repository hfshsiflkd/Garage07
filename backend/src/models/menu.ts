import mongoose, { Schema, Document } from "mongoose";

interface IMenuItem {
  name: string;
  price: string;
  desc: string;
  img: string;
  available: boolean;
}

export interface IMenuCategory extends Document {
  category: string;
  items: IMenuItem[];
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  desc: String,
  img: String,
  available: { type: Boolean, default: true },
});

const MenuCategorySchema = new Schema<IMenuCategory>({
  category: { type: String, required: true },
  items: [MenuItemSchema],
});

export default mongoose.model<IMenuCategory>("Menu", MenuCategorySchema);
