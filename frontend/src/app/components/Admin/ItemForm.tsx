"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";

export default function ItemForm({
  menu,
  onSuccess,
}: {
  menu: MenuCategory[];
  onSuccess: () => void;
}) {
  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    price: "",
    desc: "",
    img: "",
  });
  const [uploading, setUploading] = useState(false);

  // 🖼️ Cloudinary зураг upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post<{ url: string }>(
        `${API}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNewItem({ ...newItem, img: res.data.url });
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Зураг upload алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  };

  // 🍽️ Хоол нэмэх
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { category, name, price, desc, img } = newItem;
    if (!category || !name) return alert("Категори болон нэр шаардлагатай!");

    try {
      await axios.post(`${API}/api/menu/${category}/items`, {
        name,
        price,
        desc,
        img,
      });
      setNewItem({ category: "", name: "", price: "", desc: "", img: "" });
      onSuccess();
    } catch (err) {
      console.error("❌ Add item error:", err);
      alert("Хоол нэмэхэд алдаа гарлаа");
    }
  };

  return (
    <form
      onSubmit={addItem}
      className="bg-[#151518] p-4 rounded-lg border border-gray-700 grid gap-3"
    >
      <h2 className="text-lg font-semibold text-[#a7ffea]">Шинэ хоол нэмэх</h2>

      <select
        value={newItem.category}
        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        className="p-2 bg-black border border-gray-700 rounded-md"
      >
        <option value="">Категори сонгох...</option>
        {menu.map((cat) => (
          <option key={cat.category} value={cat.category}>
            {cat.category}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Хоолны нэр"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        className="p-2 bg-black border border-gray-700 rounded-md"
      />

      <input
        type="text"
        placeholder="Үнэ"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        className="p-2 bg-black border border-gray-700 rounded-md"
      />

      <textarea
        placeholder="Тайлбар"
        value={newItem.desc}
        onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
        className="p-2 bg-black border border-gray-700 rounded-md"
      />

      {/* 🖼️ Cloudinary upload */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-[#a7ffea] file:text-black
          hover:file:bg-[#8cf6db]"
        />
        {uploading && <p className="text-gray-400 mt-1">Uploading...</p>}
        {newItem.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={newItem.img}
            alt="Preview"
            className="mt-2 rounded-md w-32 h-32 object-cover border border-gray-700"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className={`font-semibold py-2 rounded-md w-full ${
          uploading
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-[#a7ffea] text-black hover:bg-[#8cf6db]"
        }`}
      >
        {uploading ? "Uploading image..." : "Add Item"}
      </button>
    </form>
  );
}
