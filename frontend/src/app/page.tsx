"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import CategoryBar from "./components/CategoryBar";
import MenuList from "./components/MenuList";
import MenuItemModal from "./components/MenuItemModal";
import Footer from "./components/Footer";
import { MenuCategory, MenuItem } from "./components/types";
import { API } from "./config";

export default function Garage07QRMenu() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("Salad");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get<MenuCategory[]>(
          `${API}/api/menu`
        );
        setMenu(res.data);
      } catch (err) {
        console.error("Menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const activeItems =
    menu.find((cat) => cat.category === activeCategory)?.items || [];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading menu...
      </div>
    );

  return (
    <div
      className="min-h-screen text-white antialiased p-4 flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/hool/black-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="w-full max-w-md h-[90vh] bg-gradient-to-b from-[#0b0b0d]/80 via-[#0b0b0d]/60 to-[#0b0b0d]/80 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        <Header />
        <CategoryBar
          menu={menu}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <MenuList items={activeItems} onSelect={setSelectedItem} />
        <Footer/>
        
      </main>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
