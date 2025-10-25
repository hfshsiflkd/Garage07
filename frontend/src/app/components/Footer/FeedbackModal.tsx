"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/context/LanguageContext";

type FeedbackState = {
  fbName: string;
  setFbName: (v: string) => void;
  fbMsg: string;
  setFbMsg: (v: string) => void;
  fbLoading: boolean;
  fbError: string | null;
  fbSuccess: boolean;
  honey: string;
  setHoney: (v: string) => void;
};

export default function FeedbackModal({
  open,
  onClose,
  state,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  state: FeedbackState;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const { lang } = useLang();
  const T =
    lang === "mn"
      ? {
          title: "Санал хүсэлт",
          name: "Нэр",
          namePh: "Таны нэр",
          msg: "Санал / хүсэлт",
          msgPh: "Бидэнд хэлэх зүйлээ энд бичнэ үү...",
          send: "Илгээх",
          sending: "Илгээж байна...",
          success: "✅ Санал хүсэлтийг хүлээн авлаа. Баярлалаа!",
          close: "Хаах",
        }
      : {
          title: "Feedback",
          name: "Name",
          namePh: "Your name",
          msg: "Message",
          msgPh: "Write your message here…",
          send: "Send",
          sending: "Sending…",
          success: "✅ Thanks! Your feedback has been received.",
          close: "Close",
        };

  const {
    fbName,
    setFbName,
    fbMsg,
    setFbMsg,
    fbLoading,
    fbError,
    fbSuccess,
    honey,
    setHoney,
  } = state;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal
          role="dialog"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="bg-[#0b0b0d]/90 border border-white/10 rounded-2xl p-5 w-[90vw] max-w-sm shadow-xl text-left"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#a7ffea]">
                {T.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
                aria-label={T.close}
                title={T.close}
              >
                ✕
              </button>
            </div>

            {fbSuccess && (
              <div className="mb-3 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 px-3 py-2 text-sm">
                {T.success}
              </div>
            )}
            {fbError && (
              <div className="mb-3 rounded-md bg-red-500/15 border border-red-500/30 text-red-200 px-3 py-2 text-sm">
                {fbError}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              {/* honeypot */}
              <input
                type="text"
                value={honey}
                onChange={(e) => setHoney(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="text-sm text-gray-300">{T.name}</label>
                <input
                  type="text"
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  placeholder={T.namePh}
                  className="w-full mt-1 p-2 rounded-md bg-black/40 border border-gray-700 text-sm"
                  required
                  maxLength={80}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">{T.msg}</label>
                <textarea
                  value={fbMsg}
                  onChange={(e) => setFbMsg(e.target.value)}
                  placeholder={T.msgPh}
                  className="w-full mt-1 p-2 rounded-md bg-black/40 border border-gray-700 text-sm h-24"
                  required
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                disabled={fbLoading}
                className={`w-full py-2 rounded-md font-semibold ${
                  fbLoading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-[#a7ffea] text-black hover:bg-[#8cf6db]"
                }`}
              >
                {fbLoading ? T.sending : T.send}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
