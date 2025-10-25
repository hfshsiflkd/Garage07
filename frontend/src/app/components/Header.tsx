"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  onMapClick?: () => void;
};

export default function Header({
  title = "Garage",
  subtitle = "Wheel • Good music • Late nights",
  logoSrc = "/Logo.jpg",
  onMapClick,
}: HeaderProps) {
  const { currency, toggle } = useCurrency();

  return (
    <header className="sticky top-0 z-20 -mx-3 -mt-3 px-3 pt-3 pb-2 mb-5">
      <div className="relative rounded-2xl border border-white/10 bg-[#0b0b0d]/70 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:linear-gradient(#000,transparent)] bg-[linear-gradient(180deg,rgba(167,255,234,0.15),transparent)]" />

        <div className="flex items-center justify-between gap-3 px-3 py-2">
          {/* Brand хэсэг */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-xl ring-1 ring-white/15 bg-black/40 flex-shrink-0">
              <Image
                src={logoSrc}
                alt="Logo"
                fill
                sizes="(max-width: 768px) 56px, 64px"
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
                {title}
              </h1>
              <p className="text-[11px] md:text-[12px] text-gray-300">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Icons — байрлал, хэмжээ, хэлбэр ижил */}
          <div className="flex items-center gap-2">
            {/* Валют солих товч */}
            <button
              onClick={toggle}
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:scale-[0.97] transition border border-white/10"
              aria-label="Валют солих"
              title="Валют солих"
            >
              <span
                className="text-base font-bold"
                style={{
                  color: currency === "MNT" ? "#22c55e" : "#60a5fa",
                }}
              >
                {currency === "MNT" ? "₮" : "$"}
              </span>
            </button>

            {/* Байрлал товч — яг ижил хэмжээ, байрлал */}
            <button
              onClick={onMapClick}
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:scale-[0.97] transition border border-white/10"
              aria-label="Байрлал"
              title="Байрлал"
            >
              <MapPin size={18} className="text-[#a7ffea]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
