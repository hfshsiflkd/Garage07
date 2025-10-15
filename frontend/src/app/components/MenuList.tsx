"use client";
import Image from "next/image";
import { MenuItem } from "./types";

type Props = {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
};

export default function MenuList({ items, onSelect }: Props) {
  return (
    <section className="flex-1 overflow-y-auto pr-2">
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.name}
            onClick={() => onSelect(it)}
            className="bg-gradient-to-r from-[#0b0b0d]/60 to-[#0b0b0d]/40 p-3 rounded-lg border border-white/5 flex items-start justify-between cursor-pointer hover:bg-[#101015]/80 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-[60px] h-[60px] overflow-hidden rounded-lg flex-shrink-0">
                <Image
                  src={it.img}
                  alt={it.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{it.name}</h3>
                <p className="text-xs text-gray-400 truncate w-30 h-5">
                  {it.desc}
                </p>
              </div>
            </div>
            <div className="text-right font-semibold">{it.price}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
