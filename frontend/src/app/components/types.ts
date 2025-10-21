export type MenuItem = {
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
  category: string;
  items: MenuItem[];
};
