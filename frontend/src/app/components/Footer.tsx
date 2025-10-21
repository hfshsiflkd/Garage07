"use client";
import { useEffect, useMemo, useState } from "react";
import { Clock, Phone, Instagram, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FooterProps = {
  open?: string;
  close?: string;
  phone?: string | string[]; // ☑ олон дугаар дэмжинэ
  instagram?: string;
};

function parseHM(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return { h, m };
}

export default function Footer({
  open = "12:00",
  close = "00:00",
  phone = "",
  instagram = "",
}: FooterProps) {
  const [{ h: oh, m: om }, { h: ch, m: cm }] = useMemo(
    () => [parseHM(open), parseHM(close)],
    [open, close]
  );

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const isOpen = useMemo(() => {
    const cur = now.getHours() * 60 + now.getMinutes();
    const start = oh * 60 + om;
    const end = ch * 60 + cm;
    return end <= start ? cur >= start || cur < end : cur >= start && cur < end;
  }, [now, oh, om, ch, cm]);

  const statusText = isOpen ? "Нээлттэй" : "Хаалттай";
  const statusColor = isOpen ? "bg-emerald-400" : "bg-red-400";

  const [showPhones, setShowPhones] = useState(false);

  const phones = Array.isArray(phone)
    ? phone
    : phone
    ? phone.split(",").map((p) => p.trim())
    : [];

  const openInstagram = () => {
    if (!instagram) return;
    const url = instagram.startsWith("http")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const call = (p: string) => {
    window.location.href = `tel:${p.replace(/\s/g, "")}`;
  };

  return (
    <footer className="mt-3 flex-shrink-0 -mx-3 -mb-3 px-3 pb-3">
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0d]/70 backdrop-blur-md px-3 py-2 relative">
        {/* Цаг ба статус */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${statusColor}`}
            />
            <span className="text-sm font-semibold">{statusText}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Clock size={14} className="text-[#a7ffea]" />
            <span>
              Ажиллах цаг: <strong>{open}</strong> — <strong>{close}</strong>
            </span>
          </div>
        </div>

        {/* Товчлуурууд */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowPhones(true)}
            disabled={!phones.length}
            className={`rounded-xl border border-white/10 bg-[#a7ffea] text-black font-semibold py-2 active:scale-[0.98] transition ${
              !phones.length ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Phone size={16} />
              <span className="text-sm">Залгах</span>
            </span>
          </button>

          <button
            onClick={openInstagram}
            disabled={!instagram}
            className={`rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium py-2 active:scale-[0.98] transition ${
              !instagram ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Instagram size={16} className="text-[#a7ffea]" />
              <span className="text-sm">Instagram</span>
            </span>
          </button>
        </div>
      </div>

      {/* ☎️ Залгах modal */}
      <AnimatePresence>
        {showPhones && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhones(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="bg-[#0b0b0d]/90 border border-white/10 rounded-2xl p-5 w-[90vw] max-w-sm shadow-xl text-center"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#a7ffea]">
                  Дугаар сонгох
                </h3>
                <button
                  onClick={() => setShowPhones(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {phones.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => call(p)}
                    className="w-full py-2 rounded-lg bg-[#a7ffea] text-black font-semibold active:scale-[0.98] transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
