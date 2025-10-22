"use client";
import { Phone, Instagram } from "lucide-react";

export default function ActionButtons({
  phones,
  instagram,
  onOpenPhones,
  onOpenFeedback,
  onOpenInstagram,
}: {
  phones: string[];
  instagram?: string;
  onOpenPhones: () => void;
  onOpenFeedback: () => void;
  onOpenInstagram: () => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      <button
        onClick={onOpenPhones}
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
        onClick={onOpenInstagram}
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

      <button
        onClick={onOpenFeedback}
        className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium py-2 active:scale-[0.98] transition"
      >
        <span className="inline-flex items-center gap-1">
          💬
          <span className="text-sm">Санал</span>
        </span>
      </button>
    </div>
  );
}
