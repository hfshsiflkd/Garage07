"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
      {/* Background shimmer line */}
      {!reduce && (
        <div className="absolute -rotate-12 -inset-x-20 top-1/3 h-24 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pan" />
      )}

      {/* Pan + ring */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-[#333] border-t-[#a7ffea] animate-spin" />
        {!reduce && (
          <div className="absolute w-12 h-12 bg-[#a7ffea] rounded-full animate-pulse opacity-15" />
        )}
        <span className={reduce ? "text-4xl" : "text-4xl animate-bounce"}>
          🍳
        </span>
      </div>

      <h2 className="text-lg font-semibold text-[#a7ffea]">
        Хоолны цэсийг бэлтгэж байна...
      </h2>
      <p className="text-sm text-gray-300 mt-2">
        Түр хүлээнэ үү — тогооч таны хоолыг хайртайгаар халааж байна 🔥
      </p>

      <style jsx>{`
        @keyframes pan {
          0% {
            transform: translateX(-20%);
          }
          100% {
            transform: translateX(20%);
          }
        }
        .animate-pan {
          animation: pan 2.8s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pan {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
