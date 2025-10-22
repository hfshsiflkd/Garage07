"use client";
import Image from "next/image";
import { MenuItem } from "@/app/components/types";
import { motion } from "framer-motion";

type Props = {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
};

const tug = (v: number | string) =>
  `₮${Number(v ?? 0).toLocaleString("mn-MN")}`;

export default function MenuList({ items, onSelect }: Props) {
  return (
    <section className="flex-1 overflow-y-auto pr-1 md:pr-2">
      <ul className="space-y-2 md:space-y-3">
        {items.map((it, idx) => {
          const key = String(it._id ?? `name-${it.name}-${idx}`);
          const isAvailable = it.available !== false;

          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={() => isAvailable && onSelect(it)}
              className={[
                "group", // hover эффектүүдийг desktop-д идэвхжүүлэхэд ашиглана
                "relative p-[1px] rounded-xl",
                // ✅ ГАДААД ГРАДИЕНТ ХҮРЭЭ — хуучинтай адил
                "bg-[linear-gradient(135deg,rgba(167,255,234,0.35),rgba(255,140,0,0.25))]",
                // Hover-г зөвхөн desktop-д
                "md:hover:bg-[linear-gradient(135deg,rgba(167,255,234,0.6),rgba(255,140,0,0.45))]",
                "transition-colors",
              ].join(" ")}
              style={{ willChange: "transform" }}
            >
              <div
                className={[
                  "relative rounded-[11px] px-3 py-3",
                  // ✅ ДОТООД ФОН — хуучинтай адил
                  "bg-gradient-to-r from-[#0b0b0d]/80 to-[#0b0b0d]/60",
                  "border border-white/5",
                  "flex items-start justify-between gap-3",
                  isAvailable
                    ? "opacity-100 active:scale-[0.99]"
                    : "opacity-40 cursor-not-allowed",
                  "transition-transform",
                ].join(" ")}
              >
                {/* Shine sweep — зөвхөн desktop hover дээр */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[11px]">
                  <span className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                </span>

                {/* Зураг */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-[60px] h-[60px] overflow-hidden rounded-lg flex-shrink-0 relative bg-black/40 ring-1 ring-white/10">
                    {it.img ? (
                      <Image
                        src={it.img}
                        alt={it.name}
                        width={60}
                        height={60}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/60 grid place-items-center">
                        <span className="text-[10px] font-bold text-white tracking-wide">
                          ДУУССАН
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Нэр + тайлбар */}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate max-w-[60vw] md:max-w-[160px]">
                      {it.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 max-w-[68vw] md:max-w-[200px]">
                      {it.desc}
                    </p>
                  </div>
                </div>

                {/* Үнэ + статус */}
                <div className="text-right shrink-0">
                  <div className="font-extrabold tracking-tight text-[15px]">
                    {tug(it.price)}
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span
                      className={[
                        "inline-block h-2 w-2 rounded-full",
                        isAvailable ? "bg-emerald-400" : "bg-gray-500",
                      ].join(" ")}
                      aria-hidden
                    />
                    <span className="text-[10px] text-gray-400">
                      {isAvailable ? "Бэлэн" : "Түр дууссан"}
                    </span>
                  </div>
                </div>

               
                
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
