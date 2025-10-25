"use client";

import { useState } from "react";
import { Eye, LogOut, MoreVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExchangeRateControl from "../Admin/ExchangeRateControl";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);

  const goHome = () => (window.location.href = "/");
  const logout = () => alert("Logging out...");

  return (
    <header className="sticky top-0 z-40">
      {/* үндсэн header */}
      <div className="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 rounded-xl bg-gradient-to-r from-[#0b0b0d]/90 via-[#121214]/90 to-[#0b0b0d]/90 border border-white/10 shadow-[0_0_16px_rgba(167,255,234,0.06)] backdrop-blur-md">
        {/* зүүн — брэнд */}
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-baseline gap-2"
        >
          <span className="text-lg md:text-2xl font-extrabold tracking-wide text-[#a7ffea]">
            Garage07
          </span>
          <span className="hidden sm:inline text-xs md:text-sm font-light text-gray-400">
            Admin Dashboard
          </span>
        </motion.h1>

        {/* баруун — desktop товчлуурууд */}
        <div className="hidden sm:flex items-center gap-2">
          <ExchangeRateControl />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={goHome}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg border border-[#a7ffea]/40 text-[#a7ffea] hover:bg-[#a7ffea]/10 transition"
          >
            <Eye size={16} />
            View Menu
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>

        {/* баруун — mobile цэс */}
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition"
          aria-label="Нэмэлт цэс"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <div className="rounded-t-2xl border border-white/10 bg-[#0b0b0d]/95 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white/80">Цэс</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10"
                    aria-label="Хаах"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      goHome();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold"
                  >
                    <Eye size={16} className="text-[#a7ffea]" />
                    View Menu
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold text-red-300"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>

                {/* drag handle */}
                <div className="mt-3 grid place-items-center">
                  <div className="h-1 w-10 rounded bg-white/15" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
