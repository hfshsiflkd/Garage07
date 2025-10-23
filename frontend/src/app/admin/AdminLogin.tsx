"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalSquare, KeyRound } from "lucide-react";

export default function AdminLogin({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [caps, setCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const CORRECT = process.env.NEXT_PUBLIC_ADMIN_PASS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pwd) return;
    setBusy(true);
    setTimeout(() => {
      if (pwd === CORRECT) {
        onLoginSuccess();
      } else {
        setError("ACCESS DENIED · Нууц үг буруу");
        setShake(true);
        setTimeout(() => setShake(false), 360);
        setBusy(false);
      }
    }, 400);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCaps(e.getModifierState?.("CapsLock") || false);
    if (e.key === "Enter") submit();
  };

  return (
    <div className="relative min-h-screen grid place-items-center bg-[#0b0b0d] text-white px-4">
      {/* --- Animated background --- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* grid dots */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* cyan + orange glows */}
        <div className="absolute -top-28 -left-24 w-80 h-80 rounded-full bg-[#a7ffea]/14 blur-[90px]"></div>
        <div className="absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-[#ff8c00]/12 blur-[110px]"></div>
        {/* scanlines */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-[0.06]"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0, rgba(255,255,255,.5) 1px, transparent 2px, transparent 4px)",
          }}
        />
      </div>

      {/* --- Card --- */}
      <div
        className={[
          "relative w-full max-w-[720px] rounded-2xl border border-white/10",
          "bg-black/30 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)]",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: terminal brand */}
          <aside className="hidden md:flex flex-col border-r border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg grid place-items-center bg-[#a7ffea]/15 border border-[#a7ffea]/30">
                  <TerminalSquare size={20} className="text-[#a7ffea]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-wide">
                    GARAGE07
                  </h2>
                  <p className="text-[11px] text-white/60">
                    Admin Console · v1.0
                  </p>
                </div>
              </div>

              {/* faux terminal window */}
              <div className="mt-6 rounded-lg border border-white/10 bg-[#0d0f12]/90 overflow-hidden">
                <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  <span className="text-[11px] ml-2 text-white/50">
                    terminal: admin@garage07
                  </span>
                </div>
                <div className="px-3 py-3 font-mono text-[12px] leading-relaxed">
                  <p className="text-[#a7ffea]">
                    $ init auth —mode=console --secure
                  </p>
                  <p className="text-white/70">…loading modules</p>
                  <p className="text-white/70">…hardening session</p>
                  <p className="text-emerald-300">OK · ready</p>
                </div>
              </div>

              <div className="mt-4 text-[12px] text-white/55 leading-relaxed">
                Зөвшөөрөгдсөн хэрэглэгч л нэвтэрнэ. Нууц үгээ бусадтай
                хуваалцахаас зайлсхий.
              </div>
            </div>

            <div className="mt-auto p-6 text-[11px] text-white/45">
              © {new Date().getFullYear()} Garage07 — internal use only
            </div>
          </aside>

          {/* Right: form */}
          <section className="p-6 md:p-8">
            {/* mobile header */}
            <div className="flex items-center gap-3 mb-6 md:hidden">
              <div className="h-10 w-10 rounded-lg grid place-items-center bg-[#a7ffea]/15 border border-[#a7ffea]/30">
                <KeyRound className="text-[#a7ffea]" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Garage07 · Admin</h1>
                <p className="text-[11px] text-white/60">console login</p>
              </div>
            </div>

            <form
              onSubmit={submit}
              className={[
                "max-w-sm rounded-xl border border-white/10 bg-[#0e1115]/60",
                "p-5 transition-transform will-change-transform",
                shake ? "motion-safe:animate-[shake_.35s_ease-in-out]" : "",
              ].join(" ")}
              style={{ transformStyle: "preserve-3d" }}
            >
              <label className="text-[12px] text-white/70">Нууц үг</label>
              <div className="mt-1 relative">
                <input
                  ref={inputRef}
                  type="password"
                  value={pwd}
                  onChange={(e) => {
                    setPwd(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={[
                    "w-full bg-black/40 border border-white/10 rounded-lg",
                    "px-3 py-3 text-sm outline-none",
                    "focus:border-[#a7ffea]/60",
                    "font-mono tracking-widest",
                  ].join(" ")}
                />
                {/* caret */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#a7ffea]">
                  ▌
                </span>
              </div>

              {/* info row */}
              <div className="mt-2 h-5 flex items-center justify-between text-[11px]">
                <span
                  className={[
                    "text-amber-300 transition-opacity",
                    caps ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  Caps Lock асаалттай
                </span>
                <span className="text-white/40">Enter → Нэвтрэх</span>
              </div>

              {/* error */}
              {error ? (
                <div className="mt-2 text-sm text-red-400">{error}</div>
              ) : (
                <div className="mt-2 h-5" />
              )}

              <button
                type="submit"
                disabled={!pwd || busy}
                className={[
                  "mt-3 w-full py-3 rounded-lg font-semibold",
                  "bg-[#a7ffea] text-black hover:bg-[#8cf6db] active:scale-[0.98] transition",
                  !pwd || busy ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {busy ? "Шалгаж байна…" : "Нэвтрэх"}
              </button>

              <div className="mt-4 text-[11px] text-white/50">
                Асуудал гарвал системийн админтай холбогдоно уу.
              </div>
            </form>

            {/* tilt hint (desktop only) */}
            <p className="hidden md:block mt-3 text-[11px] text-white/40">
              Tip: Карт дээр хулганаа хөдөлгөхөд бага зэрэг 3D tilt мэдрэгдэнэ.
            </p>
          </section>
        </div>

        {/* neon border sweep */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_210deg,rgba(167,255,234,.18),transparent_40%,rgba(255,140,0,.16))] blur-md" />
      </div>

      {/* minimal shake keyframes */}
      <style jsx global>{`
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
