"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Trash2, Check, X } from "lucide-react";
import { MenuCategory, MenuItem } from "@/app/components/types";
import ItemRow from "./ItemRow";

type Props = {
  category: MenuCategory;
  opened: boolean;
  onToggle: () => void;
  onEdit: (category: string, item: MenuItem) => void;
  onDelete: (category: string, itemId: string) => void;
  onToggleAvailability: (category: string, itemId: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void; // 🆕
  onDeleteCategory: (category: string) => void; // 🆕
  formatPrice: (v: number | string) => string;
  updating: boolean;
};

export default function CategorySection({
  category,
  opened,
  onToggle,
  onEdit,
  onDelete,
  onToggleAvailability,
  onRenameCategory,
  onDeleteCategory,
  formatPrice,
  updating,
}: Props) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newCatName, setNewCatName] = useState(category.category);

  const startRename = () => {
    setNewCatName(category.category);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewCatName(category.category);
  };

  const submitRename = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      alert("Категорийн нэр хоосон байж болохгүй.");
      return;
    }
    if (trimmed === category.category) {
      setIsRenaming(false);
      return;
    }
    onRenameCategory(category.category, trimmed);
    setIsRenaming(false);
  };

  const confirmDeleteCategory = () => {
    if (confirm(`"${category.category}" категорийг устгах уу?`)) {
      onDeleteCategory(category.category);
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-[#131317] overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white/5">
        {/* Зүүн тал: нээх/хаах + нэр/тоо */}
        <button
          onClick={onToggle}
          className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-md transition"
          aria-label="Категори нээх/хаах"
        >
          <div className="flex items-center gap-2">
            {!isRenaming ? (
              <>
                <span className="text-sm font-semibold text-[#a7ffea]">
                  {category.category}
                </span>
                <span className="text-xs text-white/60">
                  ({category.items.length})
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="text-sm bg-black/40 border border-white/15 rounded-md px-2 py-1 outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRename();
                    if (e.key === "Escape") cancelRename();
                  }}
                />
              </div>
            )}
          </div>

          <ChevronDown
            size={18}
            className={`ml-1 transition-transform ${
              opened ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Баруун тал: action-ууд */}
        <div className="flex items-center gap-2">
          {!isRenaming ? (
            <>
              <button
                onClick={startRename}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                title="Категори засах"
              >
                <Pencil size={14} />
                Засах
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-white/10 bg-red-600/70 hover:bg-red-600"
                title="Категори устгах"
              >
                <Trash2 size={14} />
                Устгах
              </button>
            </>
          ) : (
            <>
              <button
                onClick={submitRename}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-emerald-400/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200"
                title="Хадгалах"
              >
                <Check size={14} />
                Хадгалах
              </button>
              <button
                onClick={cancelRename}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                title="Цуцлах"
              >
                <X size={14} />
                Цуцлах
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div className={`${opened ? "block" : "hidden"} px-3 pb-3`}>
        {category.items.length === 0 ? (
          <div className="text-sm text-white/60 px-2 py-4">
            Энэ ангилалд хоол алга.
          </div>
        ) : (
          <ul className="space-y-3">
            {category.items.map((it, idx) => (
              <ItemRow
                key={String(it._id ?? `name-${it.name}-${idx}`)}
                categoryName={category.category}
                item={it}
                formatPrice={formatPrice}
                updating={updating}
                onEdit={() => onEdit(category.category, it)}
                onDelete={() => onDelete(category.category, String(it._id))}
                onToggleAvailability={() =>
                  onToggleAvailability(category.category, String(it._id))
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
