export type MenuItem = {
  name: string;
  price: string;
  desc: string;
  img: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};
