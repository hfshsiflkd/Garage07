"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  image?: string; // Арын зураг
  speed?: number; // Анимэйшний хурд (1 = default)
  intensity?: number; // Parallax интенсив (0-ээс 1.5 орчим)
  blur?: boolean; // Дээд давхаргад бага blur
};

export default function FancyBackground({
  image = "/hool/black-background.jpg",
  speed = 1,
  intensity = 0.6,
  blur = true,
}: Props) {
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const blobLeftRef = useRef<HTMLDivElement>(null);
  const blobRightRef = useRef<HTMLDivElement>(null);

  // motion reduce
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  const hasPointer = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  }, []);

  // Parallax (desktop)
  useEffect(() => {
    if (reduce || !hasPointer) return;
    const root = rootRef.current;
    const left = blobLeftRef.current;
    const right = blobRightRef.current;
    if (!root || !left || !right) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 2; // -1..1
        const y = (e.clientY / h - 0.5) * 2; // -1..1
        const dx = x * 12 * intensity;
        const dy = y * 10 * intensity;

        left.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        right.style.transform = `translate3d(${-dx}px, ${-dy}px, 0)`;
        if (auroraRef.current) {
          auroraRef.current.style.transform = `translate3d(${dx * 0.6}px, ${
            dy * 0.6
          }px, 0)`;
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, hasPointer, intensity]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark veil */}
      <div className="absolute inset-0 bg-[#0b0b0d]/70" />

      {/* Aurora band (зөөлөн гулсах gradient) */}
      {!reduce && (
        <div
          ref={auroraRef}
          className={`absolute inset-0 ${blur ? "backdrop-blur-[1px]" : ""}`}
        >
          <div
            className="absolute -inset-x-20 top-1/4 h-40 opacity-50 mix-blend-screen"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(167,255,234,0.18), rgba(255,140,0,0.14), rgba(167,255,234,0.18))",
              animation: `auroraShift ${
                14 / speed
              }s ease-in-out infinite alternate`,
              filter: "blur(32px)",
              transform: "rotate(-8deg)",
            }}
          />
        </div>
      )}

      {/* Floating blobs */}
      {!reduce && (
        <>
          <div
            ref={blobLeftRef}
            className="absolute -top-20 -left-24 w-[55vw] h-[55vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(167,255,234,0.28), transparent 60%)",
              animation: `floatA ${9 / speed}s ease-in-out infinite`,
              filter: "blur(6px)",
            }}
          />
          <div
            ref={blobRightRef}
            className="absolute -bottom-24 -right-24 w-[60vw] h-[60vw] max-w-[560px] max-h-[560px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,140,0,0.2), transparent 60%)",
              animation: `floatB ${12 / speed}s ease-in-out infinite`,
              filter: "blur(8px)",
            }}
          />
        </>
      )}

      {/* Grain overlay (optional: /public/hool/noise.png) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay bg-[url('/hool/noise.png')]" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)]" />

      <style jsx global>{`
        @keyframes floatA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -10px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes floatB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-12px, 8px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes auroraShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .backdrop-blur-[1px] {
            backdrop-filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}
