"use client";

import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";

export default function MenuList({
  menu,
  onDeleteSuccess,
}: {
  menu: MenuCategory[];
  onDeleteSuccess: () => void;
}) {
  const deleteCategory = async (cat: string) => {
    if (!confirm(`${cat} устгах уу?`)) return;
    try {
      await axios.delete(`${API}/api/menu/${cat}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete category error:", err);
    }
  };

  const deleteItem = async (cat: string, itemName: string) => {
    if (!confirm(`${itemName} устгах уу?`)) return;
    try {
      await axios.delete(`${API}/api/menu/${cat}/items/${itemName}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete item error:", err);
    }
  };

  return (
    <div>
      {menu.map((cat) => (
        <div key={cat.category} className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#a7ffea]">{cat.category}</h3>
            <button
              onClick={() => deleteCategory(cat.category)}
              className="text-sm px-3 py-1 bg-red-600 rounded-md"
            >
              Delete Category
            </button>
          </div>

          <div className="mt-2 grid gap-2">
            {cat.items.length === 0 ? (
              <p className="text-gray-500 text-sm">Хоосон байна.</p>
            ) : (
              cat.items.map((it) => (
                <div
                  key={it.name}
                  className="flex justify-between items-center bg-[#1a1a1c] p-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {it.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.img}
                        alt={it.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-700"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      <div className="text-sm text-gray-400">{it.price}</div>
                      {it.desc && (
                        <div className="text-xs text-gray-500 mt-1">
                          {it.desc}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem(cat.category, it.name)}
                    className="text-sm px-3 py-1 bg-red-600 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
