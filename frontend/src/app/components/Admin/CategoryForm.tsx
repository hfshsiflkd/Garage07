"use client";
import { useState } from "react";
import axios from "axios";
import { API } from "@/app/config";

export default function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [category, setCategory] = useState("");

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return alert("Category нэр оруулна уу!");
    try {
      await axios.post(`${API}/api/menu`, { category, items: [] });
      setCategory("");
      onSuccess();
    } catch (err) {
      console.error("❌ Add category error:", err);
    }
  };

  return (
    <form
      onSubmit={addCategory}
      className="bg-[#151518] p-4 rounded-lg border border-gray-700 flex gap-3"
    >
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Шинэ категори (ж: Salad)"
        className="flex-1 p-2 bg-black border border-gray-700 rounded-md"
      />
      <button
        type="submit"
        className="bg-[#a7ffea] text-black font-semibold px-4 py-2 rounded-md"
      >
        Add
      </button>
    </form>
  );
}
