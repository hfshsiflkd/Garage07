"use client";

import { useState } from "react";
import axios from "axios";
import { MenuCategory, MenuItem } from "@/app/components/types";
import ItemRow from "../ItemRow";
import { API } from "@/app/config";
import CategoryHeader from "./CategoryHeader";
import ActionsDesktop from "./ActionsDesktop";
import ActionsMobile from "./ActionsMobile";

export type CategorySectionProps = {
  category: MenuCategory;
  opened: boolean;
  onToggle: () => void;

  onEdit: (category: string, item: MenuItem) => void;
  onDelete: (category: string, itemId: string) => void;
  onToggleAvailability: (category: string, itemId: string) => void;

  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (category: string) => void;

  formatPrice: (v: number | string) => string;
  updating: boolean;
  onReorderSuccess?: () => void;
};

export default function CategorySection(props: CategorySectionProps) {
  const {
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
    onReorderSuccess,
  } = props;

  const [isRenaming, setIsRenaming] = useState(false);
  const [newCatName, setNewCatName] = useState(category.category);
  const [busy, setBusy] = useState(false);

  // rename flows
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
    if (!trimmed) return alert("Категорийн нэр хоосон байж болохгүй.");
    if (trimmed === category.category) return setIsRenaming(false);
    onRenameCategory(category.category, trimmed);
    setIsRenaming(false);
  };
  const confirmDeleteCategory = () => {
    if (confirm(`"${category.category}" категорийг устгах уу?`)) {
      onDeleteCategory(category.category);
    }
  };

  // reorder helpers (shared by Desktop + Mobile actions)
  const moveTo = async (pos: number) => {
    if (!category?._id) return;
    try {
      setBusy(true);
      await axios.patch(`${API}/api/menu/${category._id}/position`, {
        position: pos,
      });
      onReorderSuccess?.();
    } catch (e) {
      console.error("reorder error:", e);
      alert("Байрлал өөрчлөхөд алдаа гарлаа.");
    } finally {
      setBusy(false);
    }
  };
  const moveUp = () => {
    if (typeof category.position !== "number" || category.position <= 0) return;
    moveTo(category.position - 1);
  };
  const moveDown = () => {
    if (typeof category.position !== "number") return;
    moveTo(category.position + 1);
  };
  const moveFirst = () => moveTo(0);
  const moveLast = () => moveTo(9999);
  const pinFirst = async () => {
    if (!category?._id) return;
    try {
      setBusy(true);
      await axios.patch(`${API}/api/menu/${category._id}/default`, {
        isDefault: true,
      });
      onReorderSuccess?.();
    } catch (e) {
      console.error("set default error:", e);
      alert("Default болгоход алдаа гарлаа.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-[#131317] overflow-hidden">
      <div className="w-full flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-white/5">
        <CategoryHeader
          category={category}
          opened={opened}
          onToggle={onToggle}
          isRenaming={isRenaming}
          newCatName={newCatName}
          setNewCatName={setNewCatName}
          submitRename={submitRename}
          cancelRename={cancelRename}
        />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ActionsDesktop
            category={category}
            updating={updating}
            busy={busy}
            moveUp={moveUp}
            moveDown={moveDown}
            moveFirst={moveFirst}
            moveLast={moveLast}
            pinFirst={pinFirst}
            isRenaming={isRenaming}
            startRename={startRename}
            submitRename={submitRename}
            cancelRename={cancelRename}
            confirmDeleteCategory={confirmDeleteCategory}
          />
          <ActionsMobile
            category={category}
            updating={updating}
            busy={busy}
            moveUp={moveUp}
            moveDown={moveDown}
            moveFirst={moveFirst}
            moveLast={moveLast}
            pinFirst={pinFirst}
            isRenaming={isRenaming}
            startRename={startRename}
            submitRename={submitRename}
            cancelRename={cancelRename}
            confirmDeleteCategory={confirmDeleteCategory}
          />
        </div>
      </div>

      {/* Items */}
      <div className={`${opened ? "block" : "hidden"} px-3 pb-3 sm:px-4`}>
        {category.items.length === 0 ? (
          <div className="text-sm text-white/60 px-2 py-4">
            Энэ ангилалд хоол алга.
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {category.items.map((it, idx) => (
              <ItemRow
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={String((it as any)._id ?? `name-${it.name}-${idx}`)}
                categoryName={category.category}
                item={it}
                formatPrice={formatPrice}
                updating={updating || busy}
                onEdit={() => onEdit(category.category, it)}
                onDelete={() =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onDelete(category.category, String((it as any)._id))
                }
                onToggleAvailability={() =>
                  onToggleAvailability(
                    category.category,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    String((it as any)._id)
                  )
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
