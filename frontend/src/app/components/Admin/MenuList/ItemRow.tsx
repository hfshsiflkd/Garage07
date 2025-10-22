"use client";

import Image from "next/image";
import { MenuItem } from "@/app/components/types";
import { Pencil, Trash2, Power, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  categoryName: string;
  item: MenuItem;
  formatPrice: (v: number | string) => string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  updating: boolean;
};

export default function ItemRow({
  item,
  formatPrice,
  onEdit,
  onDelete,
  onToggleAvailability,
  updating,
}: Props) {
  const isAvailable = item.available !== false;

  return (
    <li className="rounded-xl border border-white/10 bg-[#0b0b0d]/70 p-3 flex items-start justify-between gap-3">
      {/* Зураг + мэдээлэл */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative w-[64px] h-[64px] overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10 flex-shrink-0">
          {item.img ? (
            <Image
              src={item.img}
              alt={item.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-[10px] text-gray-400">
              No Image
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 grid place-items-center">
              <span className="text-[10px] font-bold text-white">ДУУССАН</span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate max-w-[160px]">
              {item.name}
            </h3>
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 size={12} /> Бэлэн
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-500/15 text-gray-300 border border-gray-500/30">
                <XCircle size={12} /> Түр дууссан
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {item.desc}
          </p>
          <div className="mt-1 font-bold">{formatPrice(item.price)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 ml-auto">
        <button
          onClick={onToggleAvailability}
          disabled={updating}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border ${
            isAvailable
              ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-400 text-black"
              : "bg-emerald-500 hover:bg-emerald-600 border-emerald-400 text-black"
          }`}
          title="Бэлэн/Дууссан"
        >
          <Power size={14} />
          {isAvailable ? "Дууссан" : "Бэлэн"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
            title="Засах"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-red-600/70 hover:bg-red-600"
            title="Устгах"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
