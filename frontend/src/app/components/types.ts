export type MenuItem = {
  id: unknown;
  veg: unknown;
  spicy: unknown;
  _id(_id: unknown): unknown;
  available: boolean;
  name: string;
  price: number;
  desc: string;
  img: string;
};

export type MenuCategory = {
  isDefault: boolean;
  position: number;
  _id: string;
  category: string;
  items: MenuItem[];
};
