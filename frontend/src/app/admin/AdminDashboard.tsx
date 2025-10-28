"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";
import AdminHeader from "@/app/components/Admin/AdminHeader";
import CategoryForm from "@/app/components/Admin/CategoryForm";
import ItemForm from "@/app/components/Admin/ItemForm";
import MenuList from "@/app/components/Admin/MenuList";
import FeedbackList from "@/app/components/Admin/FeedbackList";
import FancyBackground from "../components/FancyBackground";
import LoadingScreen from "../components/LoadingScreen";

export default function AdminDashboard() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // 📱 mobile tab state
  const [tab, setTab] = useState<"main" | "feedback">("main");

  const fetchMenu = async () => {
    try {
     const res = await axios.get<{ list: MenuCategory[] }>(`${API}/api/menu`);
     setMenu(res.data.list ?? []);
    } catch (err) {
      console.error("❌ Fetch menu error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (loading) {
      return (
        <>
          <FancyBackground speed={1} intensity={0.5} />
          <LoadingScreen />
        </>
      );
    }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white py-6 md:py-8">
      <AdminHeader />

      <div className="mx-auto max-w-[1400px] px-4">
        {/* 📱 Mobile segment switcher (lg-ээс доош харагдана) */}
        <div className="mt-4 lg:hidden">
          <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
            <button
              onClick={() => setTab("main")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                tab === "main"
                  ? "bg-[#a7ffea] text-black"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Удирдлага
            </button>
            <button
              onClick={() => setTab("feedback")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                tab === "feedback"
                  ? "bg-[#a7ffea] text-black"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Санал
            </button>
          </div>
        </div>

        {/* 🧭 Desktop: төв main + баруун sticky feedback */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,820px)_360px] gap-8">
          {/* Spacer for centering (desktop only) */}
          <div className="hidden lg:block" />

          {/* 🟩 Main — desktop дээр үргэлж харагдана, mobile дээр tab='main' үед */}
          <main
            className={`${
              tab === "main" ? "block" : "hidden"
            } lg:block space-y-8`}
          >
            <CategoryForm onSuccess={fetchMenu} />
            <ItemForm menu={menu} onSuccess={fetchMenu} />
            <MenuList
              menu={menu}
              onDeleteSuccess={fetchMenu}
              onReorderSuccess={fetchMenu}
            />
          </main>

          {/* 🟦 Feedback — desktop баруун sticky; mobile дээр tab='feedback' үед */}
          <aside
            className={`${tab === "feedback" ? "block" : "hidden"} lg:block`}
          >
            <div className="lg:sticky lg:top-6">
              <div className="max-h-[70vh] lg:max-h-[calc(100vh-160px)] overflow-y-auto">
                <FeedbackList
                  title={
                    typeof window !== "undefined" && window.innerWidth < 1024
                      ? "Ирсэн санал"
                      : "Сүүлд ирсэн санал"
                  }
                  limit={6}
                  compact={true} // шахмал горим — mobile-д яг тохиромжтой
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
