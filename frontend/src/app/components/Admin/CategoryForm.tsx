"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

export default function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return alert("Категорийн нэр оруулна уу!");

    try {
      setLoading(true);
      await axios.post(`${API}/api/menu`, {
        category: category.trim(),
        items: [],
      });
      setCategory("");
      onSuccess();
    } catch (err) {
      console.error("❌ Add category error:", err);
      alert("Категори нэмэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={addCategory}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-br from-[#151518]/90 to-[#0f0f10]/90 p-4 rounded-xl border border-[#2a2a2d] shadow-[0_0_20px_rgba(167,255,234,0.05)] flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Шинэ категори (ж: Salad)"
        className="flex-1 px-3 py-2.5 rounded-lg bg-[#0b0b0d]/70 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7ffea]/50 text-sm sm:text-base"
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        type="submit"
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition ${
          loading
            ? "bg-gray-500/60 text-gray-300 cursor-not-allowed"
            : "bg-[#a7ffea] hover:bg-[#8cf6db] text-black shadow-md shadow-[#a7ffea]/20"
        }`}
      >
        <PlusCircle size={18} />
        {loading ? "Нэмж байна..." : "Категори нэмэх"}
      </motion.button>
    </motion.form>
  );
}
