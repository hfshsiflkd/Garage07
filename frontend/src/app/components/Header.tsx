"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-3 flex-shrink-0">
      <div className="flex items-center">
        <Image
          src="/hool/obud-file.png"
          alt="Garage07 Logo"
          width={120}
          height={120}
          className="object-cover"
        />
        <div className="ml-2">
          <h1
            className="text-3xl font-extrabold tracking-wide mb-1"
            style={{ textShadow: "0 2px 10px rgba(109, 41, 255, .18)" }}
          >
            Garage
          </h1>
          <p className="text-xs text-gray-300 -mt-1">
            Wheel • Good music • Late nights
          </p>
        </div>
      </div>
    </header>
  );
}
