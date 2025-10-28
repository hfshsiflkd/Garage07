"use client";
import { ChevronDown, Star } from "lucide-react";
import { MenuCategory } from "@/app/components/types";

type Props = {
  category: MenuCategory;
  opened: boolean;
  onToggle: () => void;

  isRenaming: boolean;
  newCatName: string;
  setNewCatName: (v: string) => void;
  submitRename: () => void;
  cancelRename: () => void;
};

export default function CategoryHeader({
  category,
  opened,
  onToggle,
  isRenaming,
  newCatName,
  setNewCatName,
  submitRename,
  cancelRename,
}: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 hover:bg-white/5 px-2 py-1.5 sm:py-1 rounded-md transition active:scale-[0.98]"
      aria-label="Категори нээх/хаах"
    >
      <div className="flex items-center gap-2">
        {!isRenaming ? (
          <>
            <span className="text-[13px] sm:text-sm font-semibold text-[#a7ffea] truncate max-w-[40vw] sm:max-w-none">
              {category.category}
            </span>
            <span className="text-[11px] sm:text-xs text-white/60">
              ({category.items.length})
            </span>
            {category.isDefault && (
              <span className="ml-1 sm:ml-2 inline-flex items-center gap-1 text-[11px] sm:text-xs text-amber-300">
                <Star size={12} /> Default
              </span>
            )}
            {typeof category.position === "number" && (
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-[11px] text-white/50">
                #{category.position + 1}
              </span>
            )}
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
        className={`ml-1 transition-transform ${opened ? "rotate-180" : ""}`}
      />
    </button>
  );
}
