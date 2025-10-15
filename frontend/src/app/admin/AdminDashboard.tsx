"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";
import AdminHeader from "@/app/components/Admin/AdminHeader";
import CategoryForm from "@/app/components/Admin/CategoryForm";
import ItemForm from "@/app/components/Admin/ItemForm";
import MenuList from "@/app/components/Admin/MenuList";

export default function AdminDashboard() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await axios.get<MenuCategory[]>(`${API}/api/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error("❌ Fetch menu error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading menu...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white p-8">
      <AdminHeader />
      <div className="max-w-4xl mx-auto mt-8 space-y-10">
        <CategoryForm onSuccess={fetchMenu} />
        <ItemForm menu={menu} onSuccess={fetchMenu} />
        <MenuList menu={menu} onDeleteSuccess={fetchMenu} />
      </div>
    </div>
  );
}
