"use client";
import Image from "next/image";
import { MenuItem } from "./types";

type Props = {
  item: MenuItem;
  onClose: () => void;
};

export default function MenuItemModal({ item, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0b0d] rounded-2xl p-5 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-end mb-2">
          <button
            className="text-gray-400 hover:text-white text-xl font-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <Image
          src={item.img}
          alt={item.name}
          width={400}
          height={250}
          className="rounded-lg"
        />
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
        <div className="text-right font-semibold text-[#a7ffea] text-lg">
          {item.price}
        </div>
      </div>
    </div>
  );
}
