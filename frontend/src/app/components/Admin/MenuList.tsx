"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory, MenuItem } from "@/app/components/types";

// 🟢 Cloudinary upload helper
async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data.secure_url;
}

type Props = {
  menu: MenuCategory[];
  onDeleteSuccess: () => void;
};

export default function AdminMenuList({ menu, onDeleteSuccess }: Props) {
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    category: string;
    item: MenuItem;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    img: "",
  });

  // 🟡 Item устгах
  const handleDeleteItem = async (cat: string, itemName: string) => {
    if (!confirm(`${itemName} устгах уу?`)) return;
    try {
      setUpdating(true);
      await axios.delete(`${API}/api/menu/${cat}/items/${itemName}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete item error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // 🟢 Available toggle
  const toggleAvailability = async (cat: string, itemName: string) => {
    try {
      setUpdating(true);
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
    }
  };

  // ✏️ Edit товч дарахад form-д item-ийн мэдээлэл хуулна
  const handleEdit = (category: string, item: MenuItem) => {
    setEditingItem({ category, item });
    setForm({
      name: item.name,
      price: String(item.price),
      desc: item.desc || "",
      img: item.img || "",
    });
  };

  // 🖼 Cloudinary зураг upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, img: imageUrl }));
    } catch (err) {
      console.error("❌ Image upload error:", err);
      alert("Зураг upload амжилтгүй боллоо.");
    } finally {
      setUploading(false);
    }
  };

  // 💾 Засвар хадгалах
  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      setUpdating(true);
      await axios.put(
        `${API}/api/menu/${encodeURIComponent(
          editingItem.category
        )}/items/${encodeURIComponent(editingItem.item.name)}`,
        form
      );
      onDeleteSuccess();
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Update item error:", err);
      alert("Засвар хадгалахад алдаа гарлаа.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      {menu.map((cat) => (
        <div
          key={cat.category}
          className="bg-[#151518] p-4 rounded-lg border border-gray-700 mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-[#a7ffea]">{cat.category}</h2>
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
                    <div className="w-[50px] h-[50px] rounded-md overflow-hidden relative">
                      <Image
                        src={it.img}
                        alt={it.name}
                        width={50}
                        height={50}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-400">{it.price}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(cat.category, it.name)}
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
                    onClick={() => handleEdit(cat.category, it)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md"
                  >
                    Засах
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

      {/* ✏️ Засварын modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] p-6 rounded-lg w-[400px] border border-gray-700 relative">
            <h3 className="text-lg font-semibold mb-3 text-[#a7ffea]">
              {editingItem.item.name} — Засах
            </h3>

            <label className="block text-sm mb-1">Нэр</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#111] border border-gray-600 rounded-md p-2 mb-2"
            />

            <label className="block text-sm mb-1">Үнэ</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-[#111] border border-gray-600 rounded-md p-2 mb-2"
            />

            <label className="block text-sm mb-1">Тайлбар</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="w-full bg-[#111] border border-gray-600 rounded-md p-2 mb-2"
            />

            <label className="block text-sm mb-1">
              Зураг (Cloudinary upload)
            </label>
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="w-20 h-20 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-2"
            />
            {uploading && (
              <p className="text-xs text-gray-400">
                Зураг upload хийж байна...
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700"
              >
                Цуцлах
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
