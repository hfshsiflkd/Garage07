"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuCategory } from "@/app/components/types";

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
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const ids = useMemo(() => menu.map((c) => c.category), [menu]);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Сонгосон чипийг төвд авчрах
  useEffect(() => {
    const container = scrollRef.current;
    const target = btnRefs.current[activeCategory];
    if (!container || !target) return;
    // илүү найдвартай төвлөрүүлэлт
    target.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeCategory]);

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Keyboard support
  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = ids.indexOf(activeCategory);
    if (e.key === "ArrowRight") {
      const next = ids[Math.min(idx + 1, ids.length - 1)];
      if (next) setActiveCategory(next);
    } else if (e.key === "ArrowLeft") {
      const prev = ids[Math.max(idx - 1, 0)];
      if (prev) setActiveCategory(prev);
    } else if (e.key === "Home") {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ids[0] && setActiveCategory(ids[0]);
    } else if (e.key === "End") {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ids[ids.length - 1] && setActiveCategory(ids[ids.length - 1]);
    }
  };

  return (
    <div className="relative w-full mb-4 flex-shrink-0" onKeyDown={onKeyDown}>
      <div
        ref={scrollRef}
        className="group overflow-x-auto scrollbar-hide flex gap-3 px-10 scroll-smooth select-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="tablist"
        aria-label="Цэсний ангиллууд"
      >
        {/* ⬅️ Spacer: эхэнд сумнаас зөрүүлж хоосон зай */}
        <div className="shrink-0 w-10" />

        <LayoutGroup id="categories">
          {menu.map((cat) => {
            const active = activeCategory === cat.category;
            return (
              <motion.button
                key={cat.category}
                ref={(el) => {
                  btnRefs.current[cat.category] = el;
                }}
                onClick={() => setActiveCategory(cat.category)}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${cat.category}`}
                className={[
                  "relative whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold",
                  "transition-all focus:outline-none focus:ring-2 focus:ring-[#a7ffea]/60",
                  "snap-start",
                  active
                    ? "bg-[#a7ffea] text-black border-[#a7ffea] shadow-[0_6px_24px_rgba(167,255,234,0.25)]"
                    : "bg-transparent text-[#a7ffea]/85 border-[#a7ffea]/35 hover:border-[#a7ffea]/60",
                ].join(" ")}
              >
                <span className="relative z-10">{cat.category}</span>

                {active && (
                  <>
                    <motion.span
                      layoutId="category-underline"
                      className="absolute left-3 right-3 -bottom-1 h-[2px] rounded-full bg-black/60"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                    <motion.span
                      layoutId="category-glow"
                      className="pointer-events-none absolute inset-0 rounded-full bg-white/30 mix-blend-overlay"
                      style={{ filter: "blur(8px)" }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 26,
                      }}
                    />
                  </>
                )}
              </motion.button>
            );
          })}
        </LayoutGroup>

        {/* ➡️ Spacer: төгсгөлд сумнаас зөрүүлж хоосон зай */}
        <div className="shrink-0 w-10" />
      </div>

      {/* Arrows — жаахан дотогш */}
      <button
        onClick={() => scrollBy(-160)}
        disabled={!canScrollLeft}
        className={[
          "absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 backdrop-blur-sm transition",
          canScrollLeft
            ? "bg-black/40 hover:bg-black/70 text-white"
            : "bg-black/20 text-white/40 cursor-default",
        ].join(" ")}
        aria-label="Зүүн тийш гүйлгэх"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={() => scrollBy(160)}
        disabled={!canScrollRight}
        className={[
          "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 backdrop-blur-sm transition",
          canScrollRight
            ? "bg-black/40 hover:bg-black/70 text-white"
            : "bg-black/20 text-white/40 cursor-default",
        ].join(" ")}
        aria-label="Баруун тийш гүйлгэх"
      >
        <ChevronRight size={18} />
      </button>

      {/* Fade edges — spacer-тэй тааруулж өргөнийг 10 болголоо */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#0b0b0d] to-transparent" />

      {/* Arrows */}
      <button
        onClick={() => scrollBy(-160)}
        disabled={!canScrollLeft}
        className={[
          "absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 backdrop-blur-sm transition",
          canScrollLeft
            ? "bg-black/40 hover:bg-black/70 text-white"
            : "bg-black/20 text-white/40 cursor-default",
        ].join(" ")}
        aria-label="Зүүн тийш гүйлгэх"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scrollBy(160)}
        disabled={!canScrollRight}
        className={[
          "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 backdrop-blur-sm transition",
          canScrollRight
            ? "bg-black/40 hover:bg-black/70 text-white"
            : "bg-black/20 text-white/40 cursor-default",
        ].join(" ")}
        aria-label="Баруун тийш гүйлгэх"
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
        @media (prefers-reduced-motion: reduce) {
          .group * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
