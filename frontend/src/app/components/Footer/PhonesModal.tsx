"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PhonesModal({
  open,
  phones,
  onClose,
  onCall,
}: {
  open: boolean;
  phones: string[];
  onClose: () => void;
  onCall: (p: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {phones.map((p, i) => (
                <button
                  key={i}
                  onClick={() => onCall(p)}
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
  );
}
