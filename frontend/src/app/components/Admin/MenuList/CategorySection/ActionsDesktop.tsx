"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { MenuCategory } from "@/app/components/types";

type Props = {
  category: MenuCategory;
  updating: boolean;
  busy: boolean;

  moveUp: () => void;
  moveDown: () => void;
  moveFirst: () => void;
  moveLast: () => void;
  pinFirst: () => void;

  isRenaming: boolean;
  startRename: () => void;
  submitRename: () => void;
  cancelRename: () => void;
  confirmDeleteCategory: () => void;
};

export default function ActionsDesktop({
  category,
  updating,
  busy,
  moveUp,
  moveDown,
  moveFirst,
  moveLast,
  pinFirst,
  isRenaming,
  startRename,
  submitRename,
  cancelRename,
  confirmDeleteCategory,
}: Props) {
  return (
    <div className="hidden sm:flex items-center gap-1">
      <div className="flex items-center gap-1 mr-1">
        <button
          disabled={busy || updating || (category.position ?? 0) <= 0}
          onClick={moveUp}
          className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          title="Дээш зөөх"
          aria-label="Дээш зөөх"
        >
          <ArrowUp size={14} />
        </button>
        <button
          disabled={busy || updating}
          onClick={moveDown}
          className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          title="Доош зөөх"
          aria-label="Доош зөөх"
        >
          <ArrowDown size={14} />
        </button>
        <button
          disabled={busy || updating}
          onClick={moveFirst}
          className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          title="Эхний байрлал руу"
        >
          1-р байр
        </button>
        <button
          disabled={busy || updating}
          onClick={moveLast}
          className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          title="Сүүлийн байрлал руу"
        >
          Сүүлд
        </button>
        {!category.isDefault && (
          <button
            disabled={busy || updating}
            onClick={pinFirst}
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-amber-400/30 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 disabled:opacity-50"
            title="Default болгож эхэнд тавих"
          >
            <Star size={14} />
            Default
          </button>
        )}
      </div>

      {!isRenaming ? (
        <>
          <button
            onClick={startRename}
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
            title="Категори засах"
          >
            <Pencil size={14} />
            Засах
          </button>
          <button
            onClick={confirmDeleteCategory}
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-red-600/70 hover:bg-red-600"
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
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-emerald-400/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200"
            title="Хадгалах"
          >
            <Check size={14} />
            Хадгалах
          </button>
          <button
            onClick={cancelRename}
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
            title="Цуцлах"
          >
            <X size={14} />
            Цуцлах
          </button>
        </>
      )}
    </div>
  );
}
