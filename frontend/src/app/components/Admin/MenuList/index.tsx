"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { MenuCategory, MenuItem } from "@/app/components/types";
import CategorySection from "./CategorySection";
import EditItemModal, { SavePayload } from "./EditItemModal"; 

/** ₮ формат */
const tug = (v: number | string) =>
  `₮${Number(v ?? 0).toLocaleString("mn-MN")}`;

type Props = {
  menu: MenuCategory[];
  onDeleteSuccess: () => void;
  onReorderSuccess?: () => void;
};

export default function AdminMenuList({
  menu,
  onDeleteSuccess,
  onReorderSuccess = () => {},
}: Props) {
  const [updating, setUpdating] = useState(false);

  const [editingItem, setEditingItem] = useState<{
    category: string;
    item: MenuItem;
  } | null>(null);

  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const toggleCat = (cat: string) =>
    setOpenCats((s) => ({ ...s, [cat]: !s[cat] }));

  useEffect(() => {
    if (!menu.length) return;
    const first = menu[0].category;
    setOpenCats((s) => (s[first] ? s : { ...s, [first]: true }));
  }, [menu]);

  const handleDeleteItem = async (cat: string, itemId: string) => {
    if (!confirm(`Энэ хоолыг устгах уу?`)) return;
    try {
      setUpdating(true);
      await axios.delete(
        `${API}/api/menu/${encodeURIComponent(cat)}/items/${encodeURIComponent(
          itemId
        )}`
      );
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Delete item error:", err);
      alert("Устгахад алдаа гарлаа.");
    } finally {
      setUpdating(false);
    }
  };

  const toggleAvailability = async (cat: string, itemId: string) => {
    try {
      setUpdating(true);
      await axios.put(
        `${API}/api/menu/${encodeURIComponent(cat)}/items/${encodeURIComponent(
          itemId
        )}/availability`
      );
      onDeleteSuccess();
    } catch (err) {
      console.error("❌ Toggle availability error:", err);
      alert("Төлөв солиход алдаа гарлаа.");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditOpen = (category: string, item: MenuItem) => {
    setEditingItem({ category, item });
  };

  // 💾 Save — EditItemModal-оос ирэх SavePayload-т таарууллаа
  const handleEditSave = async (payload: SavePayload) => {
    if (!editingItem) return;
    try {
      setUpdating(true);

      const priceNum = Number(payload.price);
      if (Number.isNaN(priceNum)) {
        alert("Үнэ буруу. Тоо оруулна уу.");
        setUpdating(false);
        return;
      }

      // Илгээх body-г payload-оос уян хатан бүрдүүлнэ
      const body: Record<string, unknown> = {
        name: payload.name.trim(),
        price: priceNum,
        desc: payload.desc.trim(),
      };

      // Зургийн логик: removeImage > img шинээр > (үл өөрчилөх — огт бүү илгээ)
      if (payload.removeImage) {
        body.removeImage = true;
      } else if (payload.img && payload.img.trim()) {
        body.img = payload.img.trim();
      }

      await axios.put(
        `${API}/api/menu/${encodeURIComponent(
          editingItem.category
        )}/items/${encodeURIComponent(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          String((editingItem.item as any)._id ?? editingItem.item.id)
        )}`,
        body
      );

      onDeleteSuccess();
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Update item error:", err);
      alert("Засвар хадгалахад алдаа гарлаа.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    if (!newName.trim()) {
      alert("Шинэ нэр хоосон байж болохгүй.");
      return;
    }
    try {
      await axios.put(`${API}/api/menu/${encodeURIComponent(oldName)}`, {
        newCategory: newName.trim(),
      });
      onDeleteSuccess(); // таны refresh/fetchMenu
    } catch (e) {
      console.error("❌ Rename category error:", e);
      alert("Категори засахад алдаа гарлаа.");
    }
  };
  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`"${category}" категорийг устгах уу?`)) return;
    try {
      await axios.delete(`${API}/api/menu/${encodeURIComponent(category)}`);
      onDeleteSuccess(); // таны refresh/fetchMenu
    } catch (e) {
      console.error("❌ Delete category error:", e);
      alert("Категори устгахад алдаа гарлаа.");
    }
  };

  return (
    <section className="relative">
      {menu.map((cat) => {
        const opened = !!openCats[cat.category];

        return (
          <CategorySection
            key={cat.category}
            category={cat}
            opened={opened}
            onToggle={() => toggleCat(cat.category)}
            onEdit={handleEditOpen}
            onDelete={handleDeleteItem}
            onToggleAvailability={toggleAvailability}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            formatPrice={tug}
            updating={updating}
            onReorderSuccess={onReorderSuccess}
          />
        );
      })}

      {editingItem && (
        <EditItemModal
          item={editingItem.item}
          onClose={() => setEditingItem(null)}
          onSave={handleEditSave} // ✅ Одоо төрөл таарсан
        />
      )}
    </section>
  );
}
