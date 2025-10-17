"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";

type Props = {
  menu: MenuCategory[];
  onDeleteSuccess: () => void;
};

export default function AdminMenuList({ menu, onDeleteSuccess }: Props) {
  const [updating, setUpdating] = useState(false);
  const [loadingText, setLoadingText] = useState(""); // 🟡 шинээр нэмэв

  // 🟡 Item устгах
  const handleDeleteItem = async (cat: string, itemName: string) => {
    if (!confirm(`${itemName} устгах уу?`)) return;
    try {
      setUpdating(true);
      setLoadingText(`${itemName} устгаж байна...`);
      await axios.delete(`${API}/api/menu/${cat}/items/${itemName}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete item error:", err);
    } finally {
      setUpdating(false);
      setLoadingText("");
    }
  };

  // 🟢 Available toggle
  const toggleAvailability = async (
    cat: string,
    itemName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _available?: boolean
  ) => {
    try {
      setUpdating(true);
      setLoadingText(`${itemName} төлөв шинэчилж байна...`);
      await axios.put(
        `${API}/api/menu/${encodeURIComponent(cat)}/items/${encodeURIComponent(
          itemName
        )}/availability`
      );
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Toggle availability error:", err);
    } finally {
      setUpdating(false);
      setLoadingText("");
    }
  };

  // 🔴 Category устгах
  const handleDeleteCategory = async (cat: string) => {
    if (!confirm(`${cat} category-г устгах уу?`)) return;
    try {
      setUpdating(true);
      setLoadingText(`${cat} ангилал устгаж байна...`);
      await axios.delete(`${API}/api/menu/${cat}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete category error:", err);
    } finally {
      setUpdating(false);
      setLoadingText("");
    }
  };

  return (
    <div className="relative">
      {/* 🌀 LOADING OVERLAY */}
      {updating && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg">
          <div className="w-10 h-10 border-4 border-t-transparent border-teal-400 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-300">
            {loadingText || "Шинэчлэлт хийгдэж байна..."}
          </p>
        </div>
      )}

      <div
        className={`space-y-8 ${
          updating ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {menu.map((cat) => (
          <div
            key={cat.category}
            className="bg-[#151518] p-4 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-[#a7ffea]">
                {cat.category}
              </h2>
              <button
                onClick={() => handleDeleteCategory(cat.category)}
                className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
              >
                Delete Category
              </button>
            </div>

            <div className="space-y-2">
              {cat.items.map((it) => (
                <div
                  key={it.name}
                  className={`flex justify-between items-center p-3 rounded-md border border-gray-700 ${
                    it.available ? "bg-[#1a1a1c]" : "bg-[#1a1a1c]/50 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {it.img && (
                      <div className="w-[50px] h-[50px] rounded-md overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={it.img}
                          alt={it.name}
                          width={50}
                          height={50}
                          className="w-full h-full object-cover"
                        />
                        {!it.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold">
                            ДУУССАН
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      <div className="text-sm text-gray-400">{it.price}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        toggleAvailability(cat.category, it.name, it.available)
                      }
                      disabled={updating}
                      className={`px-3 py-1 rounded-md text-sm ${
                        it.available
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {it.available ? "Дууссан болгох" : "Бэлэн болгох"}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(cat.category, it.name)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded-md"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
