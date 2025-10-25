"use client";

import Image from "next/image";
import { MenuItem } from "@/app/components/types";
import { Pencil, Trash2, Power, CheckCircle2, XCircle } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useMemo } from "react";

type Props = {
  categoryName: string;
  item: MenuItem;
  /** Хэрэв гаднаас өгвөл MNT-г форматлахад ашиглана; үгүй бол Intl-г ашиглана */
  formatPrice?: (v: number | string) => string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  updating: boolean;
  /** ₮ + $-ыг зэрэг харуулах эсэх (default: true) */
  showBothCurrency?: boolean;
};

export default function ItemRow({
  item,
  formatPrice,
  onEdit,
  onDelete,
  onToggleAvailability,
  updating,
  showBothCurrency = true,
}: Props) {
  const isAvailable = item.available !== false;

  const { rateMntPerUsd } = useCurrency();
  const mnt = Number(item.price ?? 0);
  const mntText =
    formatPrice?.(mnt) ??
    `₮${mnt.toLocaleString("mn-MN", { maximumFractionDigits: 0 })}`;

  const usd = useMemo(
    () => (rateMntPerUsd > 0 ? mnt / rateMntPerUsd : 0),
    [mnt, rateMntPerUsd]
  );
  const usdText = `$${usd.toFixed(2)}`;

  const handleDelete = () => {
    if (confirm(`"${item.name}"-г устгах уу?`)) onDelete();
  };

  return (
    <li
      className="rounded-xl border border-white/10 bg-[#0b0b0d]/70 p-3 flex items-start justify-between gap-3"
      role="listitem"
      aria-label={`${item.name} — ${isAvailable ? "бэлэн" : "түр дууссан"}`}
    >
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
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
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
              <span
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                title="Статус: бэлэн"
              >
                <CheckCircle2 size={12} /> Бэлэн
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-500/15 text-gray-300 border border-gray-500/30"
                title="Статус: түр дууссан"
              >
                <XCircle size={12} /> Түр дууссан
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {item.desc}
          </p>

          {/* ₮ + $ зэрэг */}
          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold">{mntText}</span>
            {showBothCurrency && (
              <span className="text-xs text-white/80 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">
                {usdText}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-gray-400">
            Ханш: 1$ ≈ {rateMntPerUsd.toLocaleString("mn-MN")}₮
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 ml-auto">
        <button
          onClick={onToggleAvailability}
          disabled={updating}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition
            ${
              isAvailable
                ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-400 text-black"
                : "bg-emerald-500 hover:bg-emerald-600 border-emerald-400 text-black"
            } ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
          title="Бэлэн/Дууссан"
          aria-pressed={!isAvailable}
        >
          <Power size={14} />
          {isAvailable ? "Дууссан" : "Бэлэн"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
            title="Засах"
            aria-label="Засах"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-red-600/70 hover:bg-red-600 transition"
            title="Устгах"
            aria-label="Устгах"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
