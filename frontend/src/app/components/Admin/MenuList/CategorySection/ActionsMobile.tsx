"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  MoreHorizontal,
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

export default function ActionsMobile({
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
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md border border-white/10 bg-white/5 active:scale-[0.98]"
        aria-label="Илүү үйлдлүүд"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <button
            aria-hidden
            className="fixed inset-0 z-10 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-[220px] rounded-xl border border-white/10 bg-[#0f0f10] shadow-2xl p-2">
            <div className="text-[11px] px-2 py-1 text-white/60">Байрлал</div>
            <div className="grid grid-cols-2 gap-2 p-2 pt-1">
              <button
                disabled={busy || updating || (category.position ?? 0) <= 0}
                onClick={() => {
                  moveUp();
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] disabled:opacity-50"
              >
                <ArrowUp size={16} /> Дээш
              </button>
              <button
                disabled={busy || updating}
                onClick={() => {
                  moveDown();
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] disabled:opacity-50"
              >
                <ArrowDown size={16} /> Доош
              </button>
              <button
                disabled={busy || updating}
                onClick={() => {
                  moveFirst();
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] disabled:opacity-50 col-span-2"
              >
                1-р байр
              </button>
              <button
                disabled={busy || updating}
                onClick={() => {
                  moveLast();
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] disabled:opacity-50 col-span-2"
              >
                Сүүлд
              </button>
              {!category.isDefault && (
                <button
                  disabled={busy || updating}
                  onClick={() => {
                    pinFirst();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-200 active:scale-[0.98] col-span-2"
                >
                  <Star size={16} /> Default
                </button>
              )}
            </div>

            <div className="text-[11px] px-2 pt-1 text-white/60">Засвар</div>
            <div className="grid grid-cols-2 gap-2 p-2 pt-1">
              {!isRenaming ? (
                <>
                  <button
                    onClick={() => {
                      startRename();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98]"
                  >
                    <Pencil size={16} /> Засах
                  </button>
                  <button
                    onClick={() => {
                      confirmDeleteCategory();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-200 active:scale-[0.98]"
                  >
                    <Trash2 size={16} /> Устгах
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      submitRename();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 active:scale-[0.98]"
                  >
                    <Check size={16} /> Хадгалах
                  </button>
                  <button
                    onClick={() => {
                      cancelRename();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98]"
                  >
                    <X size={16} /> Цуцлах
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
