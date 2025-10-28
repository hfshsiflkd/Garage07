"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import CategoryBar from "./components/CategoryBar";
import MenuList from "./components/MenuList";
import MenuItemModal from "./components/MenuItemModal";
import Footer from "./components/Footer";
import FancyBackground from "./components/FancyBackground";
import LoadingScreen from "./components/LoadingScreen";
import { MenuCategory, MenuItem } from "./components/types";
import { API } from "./config";
import AnimatedBackground from "./components/AnimatedBackground";

export default function Garage07QRMenu() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get<{ list: MenuCategory[] }>(
          `${API}/api/menu`
        );
        const list = res.data.list || [];

        // ⚙️ Default-ийг (isDefault=true) эсвэл хамгийн эхнийхийг идэвхжүүлэх
        const firstActive =
          list.find((c) => c.isDefault) || (list.length > 0 ? list[0] : null);

        setMenu(list);
        if (firstActive) setActiveCategory(firstActive.category);
      } catch (err) {
        console.error("Menu fetch error:", err);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const activeItems =
    menu.find((cat) => cat.category === activeCategory)?.items || [];

  if (loading) {
    return (
      <>
        <FancyBackground speed={1} intensity={0.5} />
        <LoadingScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen text-white antialiased p-4 flex items-center justify-center relative">
      <AnimatedBackground speed={1.1} intensity={0.6} />

      <main className="w-full max-w-md h-[90vh] bg-gradient-to-b from-[#0b0b0d]/80 via-[#0b0b0d]/60 to-[#0b0b0d]/80 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        <Header
          title="Garage"
          subtitle="Wheel • Good music • Late nights"
          onMapClick={() =>
            window.open("https://maps.app.goo.gl/UG6oX1xRfvL3oDSj6", "_blank")
          }
        />

        <CategoryBar
          menu={menu}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <MenuList items={activeItems} onSelect={setSelectedItem} />

        <Footer
          open="12:00"
          close="00:00"
          phone={["+976 80247456", "+976 88890048", "+976 91136890"]}
          instagram="@the07.garage"
        />
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
