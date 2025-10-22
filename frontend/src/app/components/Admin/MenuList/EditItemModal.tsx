"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MenuItem } from "@/app/components/types";
import { API } from "@/app/config";
import { ImageIcon } from "lucide-react";

export type SavePayload = {
  name: string;
  price: string;
  desc: string;
  img?: string; // шинэ зураг байвал илгээнэ
  removeImage?: boolean; // устгах сонгосон үед true
};

type Props = {
  item: MenuItem;
  onClose: () => void;
  onSave: (payload: SavePayload) => Promise<void> | void;
};

export default function EditItemModal({ item, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    img: "", // одоогийн зураг (preview)
  });

  // 🖼 Зургийн горим: keep | replace | remove
  const [imgMode, setImgMode] = useState<"keep" | "replace" | "remove">("keep");
  const [newImgUrl, setNewImgUrl] = useState<string>("");

  // Upload төлөв
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  useEffect(() => {
    setForm({
      name: item.name,
      price: String(item.price),
      desc: item.desc || "",
      img: item.img || "",
    });
    setImgMode("keep");
    setNewImgUrl("");
    setUploading(false);
    setUploadPct(0);
  }, [item]);

  // 🖼 Шинэ зураг upload (POST /api/upload -> { url })
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      setUploading(true);
      setUploadPct(0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt: ProgressEvent) => {
          if (!evt.total) return;
          setUploadPct(Math.round((evt.loaded * 100) / evt.total));
        },
      };

      const res = await axios.post<{ url: string }>(
        `${API}/api/upload`,
        fd,
        config
      );

      setNewImgUrl(res.data.url);
      setImgMode("replace");
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Зураг upload амжилтгүй боллоо.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadPct(0), 600);
    }
  };

  const handleSave = () => {
    const payload: SavePayload = {
      name: form.name.trim(),
      price: form.price.trim(),
      desc: form.desc.trim(),
    };

    // зурагны 3 горим
    if (imgMode === "replace" && newImgUrl) {
      payload.img = newImgUrl; // шинэ зураг URL
    } else if (imgMode === "remove") {
      payload.removeImage = true; // зураг устгах
    }
    // keep үед зурагтай холбоотой талбар явуулахгүй

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#1a1a1d] border border-white/10 rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#a7ffea]">
            {item.name} — Засах
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        {/* Нэр */}
        <label className="block text-sm mb-1">Нэр</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-black/40 border border-gray-700 rounded-md p-2 mb-2 text-sm"
        />

        {/* Үнэ */}
        <label className="block text-sm mb-1">Үнэ</label>
        <input
          inputMode="decimal"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full bg-black/40 border border-gray-700 rounded-md p-2 mb-2 text-sm"
        />

        {/* Тайлбар */}
        <label className="block text-sm mb-1">Тайлбар</label>
        <textarea
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          className="w-full bg-black/40 border border-gray-700 rounded-md p-2 mb-2 text-sm h-24"
        />

        {/* 🖼 Зураг */}
        <div className="mt-3">
          <label className="block text-sm font-medium mb-2">Зураг</label>

          {/* сонголтууд */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setImgMode("keep")}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                imgMode === "keep"
                  ? "bg-white/15 border-white/20"
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              }`}
            >
              Хэвээр
            </button>

            <button
              type="button"
              onClick={() => setImgMode("replace")}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                imgMode === "replace"
                  ? "bg-white/15 border-white/20"
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              }`}
            >
              Шинэ зураг
            </button>

            <button
              type="button"
              onClick={() => {
                setImgMode("remove");
                setNewImgUrl("");
              }}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                imgMode === "remove"
                  ? "bg-white/15 border-white/20"
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              }`}
            >
              Устгах
            </button>
          </div>

          {/* preview + upload */}
          {imgMode === "keep" && (
            <>
              {form.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.img}
                  alt="current"
                  className="w-20 h-20 object-cover rounded border border-white/10"
                />
              ) : (
                <div className="text-xs text-gray-400">Одоогоор зураггүй.</div>
              )}
            </>
          )}

          {imgMode === "replace" && (
            <div className="space-y-2">
              {uploading && (
                <div className="mt-1">
                  <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#a7ffea] transition-all"
                      style={{ width: `${uploadPct}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Upload: {uploadPct}%
                  </div>
                </div>
              )}
              {(newImgUrl || form.img) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={newImgUrl || form.img}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border border-white/10"
                />
              )}
              <label className="group grid place-items-center w-full h-24 rounded-xl border border-dashed border-white/15 bg-black/20 hover:bg-black/30 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
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
            </div>
          )}

          {imgMode === "remove" && (
            <p className="text-xs text-red-300">
              Энэхүү хоол зураггүй болно (устгана).
            </p>
          )}
        </div>

        {/* Үйлдлүүд */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
          >
            Цуцлах
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-md bg-[#a7ffea] hover:bg-[#8cf6db] text-black font-semibold text-sm"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}
