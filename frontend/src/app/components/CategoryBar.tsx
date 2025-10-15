"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuCategory } from "./types";

type Props = {
  menu: MenuCategory[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
};

export default function CategoryBar({
  menu,
  activeCategory,
  setActiveCategory,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full mb-4 flex-shrink-0">
      {/* Scrollable categories */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide flex space-x-3 px-10 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {menu.map((cat) => (
          <motion.button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.08,
              backgroundColor:
                activeCategory === cat.category
                  ? "#a7ffea"
                  : "rgba(167,255,234,0.08)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition-all
              ${
                activeCategory === cat.category
                  ? "bg-[#a7ffea] text-black border-[#a7ffea]"
                  : "bg-transparent text-[#a7ffea]/80 border-[#a7ffea]/40"
              }`}
          >
            {cat.category}
          </motion.button>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => scrollBy(-150)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full z-10 backdrop-blur-sm transition"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scrollBy(150)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full z-10 backdrop-blur-sm transition"
      >
        <ChevronRight size={18} />
      </button>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#0b0b0d] to-transparent" />

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
