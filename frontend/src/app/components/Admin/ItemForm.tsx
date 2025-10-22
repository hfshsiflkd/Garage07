"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory } from "@/app/components/types";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Check,
  Trash2,
  AlertCircle,
} from "lucide-react";

/* ₮ форматлагч / бутлагч */
const formatTug = (raw: string) => {
  const n = raw.replace(/[^\d]/g, "");
  if (!n) return "";
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const parseTug = (raw: string) => Number(raw.replace(/[^\d.-]/g, "") || 0);

type Props = {
  menu: MenuCategory[];
  onSuccess: () => void;
};

export default function ItemForm({ menu, onSuccess }: Props) {
  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    price: "", // formatted string (e.g. "12,000")
    desc: "",
    img: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceNum = parseTug(newItem.price);
  const canSubmit =
    !!newItem.category &&
    !!newItem.name.trim() &&
    newItem.price.trim().length > 0 &&
    !Number.isNaN(priceNum) &&
    priceNum >= 0 &&
    !!newItem.img &&
    !uploading &&
    !submitting;

  /* 🖼️ Cloudinary → таны backend /api/upload руу */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(null);
      setUploading(true);
      setUploadPct(0);

      const res = await axios.post<{ url: string }>(
        `${API}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // onUploadProgress isn't recognized by the current axios types here, cast to any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUploadProgress: (evt: any) => {
            if (!evt?.total) return;
            const pct = Math.round((evt.loaded * 100) / evt.total);
            setUploadPct(pct);
          },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      );

      setNewItem((p) => ({ ...p, img: res.data.url }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      setError("Зураг upload амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadPct(0), 600);
    }
  };

  const clearImage = () => {
    setNewItem((p) => ({ ...p, img: "" }));
    setUploadPct(0);
  };

  /* ₮ үнэ — форматтай оруулах */
  const onPriceChange = (v: string) => {
    const fmt = formatTug(v);
    setNewItem((p) => ({ ...p, price: fmt }));
  };

  /* 🍽️ Хоол нэмэх */
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newItem.img) return setError("Зураг заавал оруулна уу.");
    if (!newItem.category || !newItem.name.trim())
      return setError("Категори болон нэрийг бөглөнө үү.");
    if (Number.isNaN(priceNum)) return setError("Үнэ буруу. Тоо оруулна уу.");

    try {
      setSubmitting(true);
      await axios.post(
        `${API}/api/menu/${encodeURIComponent(newItem.category)}/items`,
        {
          name: newItem.name.trim(),
          price: priceNum,
          desc: newItem.desc.trim(),
          img: newItem.img,
        }
      );

      // Reset
      setNewItem({ category: "", name: "", price: "", desc: "", img: "" });
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Add item error:", err);
      setError(err?.response?.data?.message || "Хоол нэмэхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={addItem}
      noValidate
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gradient-to-br from-[#151518]/90 to-[#0f0f10]/90 rounded-2xl border border-[#2a2a2d] shadow-[0_0_20px_rgba(167,255,234,0.05)] p-4 md:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#a7ffea]">Шинэ хоол нэмэх</h2>
        {canSubmit ? (
          <span className="inline-flex items-center gap-1 text-emerald-300 text-xs">
            <Check size={14} /> Бэлэн
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            Шаардлагатай талбаруудыг бөглөнө үү
          </span>
        )}
      </div>

      {/* Алдаа мессеж */}
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-200">
          <AlertCircle size={16} className="mt-[2px]" />
          <div>{error}</div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {/* Категори */}
        <div className="md:col-span-1">
          <label className="block text-xs text-gray-400 mb-1">Категори</label>
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full px-3 py-2.5 rounded-lg bg-[#0b0b0d]/70 border border-white/10 text-sm"
            required
          >
            <option value="">Категори сонгох...</option>
            {menu.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        {/* Нэр */}
        <div className="md:col-span-1">
          <label className="block text-xs text-gray-400 mb-1">Хоолны нэр</label>
          <input
            type="text"
            placeholder="ж: Caesar Salad"
            value={newItem.name}
            onChange={(e) =>
              setNewItem((p) => ({ ...p, name: e.target.value }))
            }
            className="w-full px-3 py-2.5 rounded-lg bg-[#0b0b0d]/70 border border-white/10 text-sm"
            required
          />
        </div>

        {/* Үнэ (₮) */}
        <div className="md:col-span-1">
          <label className="block text-xs text-gray-400 mb-1">Үнэ</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-sm select-none">
              ₮
            </span>
            <input
              inputMode="numeric"
              placeholder="ж: 12,000"
              value={newItem.price}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-[#0b0b0d]/70 border border-white/10 text-sm"
              required
            />
          </div>
        </div>

        {/* Тайлбар */}
        <div className="md:col-span-1">
          <label className="block text-xs text-gray-400 mb-1">
            Тайлбар (сонголттой)
          </label>
          <input
            placeholder="ж: Шинэхэн ногоо, пармезан бяслагтай"
            value={newItem.desc}
            onChange={(e) =>
              setNewItem((p) => ({ ...p, desc: e.target.value }))
            }
            className="w-full px-3 py-2.5 rounded-lg bg-[#0b0b0d]/70 border border-white/10 text-sm"
          />
        </div>

        {/* Зураг upload + preview */}
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-2">
            Зураг (заавал)
          </label>

          {!newItem.img ? (
            <label className="group grid place-items-center w-full h-40 rounded-xl border border-dashed border-white/15 bg-black/20 hover:bg-black/30 cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center text-center">
                <ImageIcon className="mb-2 text-[#a7ffea]" size={24} />
                <div className="text-sm">
                  Зураг сонгох эсвэл чирж оруулна уу
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  JPG, PNG (≤ 5MB)
                </div>
              </div>
            </label>
          ) : (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newItem.img}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-lg border border-white/10"
              />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm">
                  <Upload size={16} />
                  Дахин сонгох
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 text-sm"
                >
                  <Trash2 size={16} />
                  Устгах
                </button>
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="mt-2">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#a7ffea] transition-all"
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Upload: {uploadPct}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <motion.button
          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit ? 0.97 : 1 }}
          type="submit"
          disabled={!canSubmit}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold ${
            !canSubmit
              ? "bg-gray-600/50 text-gray-300 cursor-not-allowed"
              : "bg-[#a7ffea] hover:bg-[#8cf6db] text-black shadow-md shadow-[#a7ffea]/20"
          }`}
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          {submitting ? "Нэмэж байна..." : "Add Item"}
        </motion.button>

        <button
          type="button"
          onClick={() =>
            setNewItem({ category: "", name: "", price: "", desc: "", img: "" })
          }
          className="sm:w-40 inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
        >
          Цэвэрлэх
        </button>
      </div>

      {/* Доод тайлбар */}
      <p className="mt-3 text-xs text-gray-400">
        * Зураг байж байж “Add Item” идэвхжинэ. Үнийг “₮ 12,000” хэлбэрээр
        автоматаар форматлана.
      </p>
    </motion.form>
  );
}
