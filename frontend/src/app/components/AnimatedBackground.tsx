"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  speed?: number; // 1 = default (өсгөвөл хурдна)
  intensity?: number; // 0.0 - 1.2 орчим (parallax хүч)
  blur?: boolean; // aurora дээр бага blur
};

export default function AnimatedBackground({
  speed = 1,
  intensity = 0.6,
  blur = true,
}: Props) {
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const blobL = useRef<HTMLDivElement>(null);
  const blobR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  const hasPointer = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  }, []);

  // Parallax (mouse) — desktop-д л идэвхтэй
  useEffect(() => {
    if (reduce || !hasPointer) return;
    const l = blobL.current,
      r = blobR.current,
      a = auroraRef.current;
    if (!l || !r) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        const dx = x * 12 * intensity;
        const dy = y * 10 * intensity;
        l.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        r.style.transform = `translate3d(${-dx}px, ${-dy}px, 0)`;
        if (a)
          a.style.transform = `translate3d(${dx * 0.6}px, ${dy * 0.6}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, hasPointer, intensity]);

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 -z-10">
      {/* Base gradient (зураггүй, гүн) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_0%,#0f1318_0%,#0b0b0d_45%,#0b0b0d_100%)]" />

      {/* Aurora band */}
      {!reduce && (
        <div ref={auroraRef} className={blur ? "backdrop-blur-[1px]" : ""}>
          <div
            className="absolute -inset-x-24 top-1/3 h-40 opacity-55 mix-blend-screen"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(167,255,234,0.18), rgba(255,140,0,0.16), rgba(167,255,234,0.18))",
              animation: `aurora ${14 / speed}s ease-in-out infinite alternate`,
              filter: "blur(34px)",
              transform: "rotate(-10deg)",
            }}
          />
        </div>
      )}

      {/* Floating blobs */}
      {!reduce && (
        <>
          <div
            ref={blobL}
            className="absolute -top-24 -left-24 w-[56vw] h-[56vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(167,255,234,0.28), transparent 60%)",
              animation: `floatA ${9 / speed}s ease-in-out infinite`,
              filter: "blur(6px)",
            }}
          />
          <div
            ref={blobR}
            className="absolute -bottom-28 -right-24 w-[60vw] h-[60vw] max-w=[560px] max-h-[560px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,140,0,0.22), transparent 60%)",
              animation: `floatB ${12 / speed}s ease-in-out infinite`,
              filter: "blur(9px)",
            }}
          />
        </>
      )}

      {/* Grain + Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay bg-[url('/hool/noise.png')]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)]" />

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
        @keyframes aurora {
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
