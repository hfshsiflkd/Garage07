"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MenuItem } from "./types";

type Props = {
  item: MenuItem | null;
  onClose: () => void;
};

const tug = (v: number | string) =>
  `₮${Number(v ?? 0).toLocaleString("mn-MN")}`;

export default function MenuItemModal({ item, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Escape дарахад хаагдана
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  // Scroll lock
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* dark backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* centered modal box */}
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto w-[92vw] max-w-sm rounded-2xl border border-white/10 
                       bg-gradient-to-b from-[#0b0b0d]/90 to-[#0b0b0d]/70 shadow-2xl overflow-hidden"
          >
            {/* ❌ Close */}
            <button
              onClick={onClose}
              aria-label="Хаах"
              className="absolute right-2 top-2 z-10 grid place-items-center rounded-full 
                         bg-black/40 hover:bg-black/60 active:scale-95 transition p-2 border border-white/10"
            >
              <X size={18} className="text-white/90" />
            </button>

            {/* 🖼 Зураг */}
            <div className="relative w-full h-48 sm:h-56 bg-black/40">
              {item.img ? (
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs">
                  No Image
                </div>
              )}

              {!item.available && (
                <div className="absolute inset-0 bg-black/60 grid place-items-center">
                  <span className="text-white text-xs font-bold tracking-wide">
                    ТҮР ДУУССАН
                  </span>
                </div>
              )}
            </div>

            {/* 🧾 Агуулга */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold leading-6">{item.name}</h3>
                <div className="text-right">
                  <div className="text-[15px] font-extrabold text-[#a7ffea]">
                    {tug(item.price)}
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        item.available ? "bg-emerald-400" : "bg-gray-500"
                      }`}
                    />
                    <span className="text-[10px] text-gray-400">
                      {item.available ? "Бэлэн" : "Түр дууссан"}
                    </span>
                  </div>
                </div>
              </div>

              {item.desc && (
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
