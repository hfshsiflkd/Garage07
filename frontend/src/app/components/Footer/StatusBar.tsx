"use client";
import { Clock } from "lucide-react";
import { useLang } from "@/app/context/LanguageContext";

export default function StatusBar({
  isOpen,
  open,
  close,
}: {
  isOpen: boolean;
  open: string;
  close: string;
}) {
  const { lang } = useLang();
  const statusText =
    lang === "mn"
      ? isOpen
        ? "Нээлттэй"
        : "Хаалттай"
      : isOpen
      ? "Open"
      : "Closed";
  const statusColor = isOpen ? "bg-emerald-400" : "bg-red-400";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${statusColor}`}
        />
        <span className="text-sm font-semibold">{statusText}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Clock size={14} className="text-[#a7ffea]" />
        {lang === "mn" ? (
          <span>
            Ажиллах цаг: <strong>{open}</strong> — <strong>{close}</strong>
          </span>
        ) : (
          <span>
            Hours: <strong>{open}</strong> — <strong>{close}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
