"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Currency = "MNT" | "USD";

export type CurrencyContextType = {
  currency: Currency;
  rateMntPerUsd: number; 
  setRateMntPerUsd: (n: number) => void;
  setCurrency: (c: Currency) => void;
  toggle: () => void;

  // Хөрвүүлэлт
  convertToUSD: (mntValue: number) => number;
  convertToMNT: (usdValue: number) => number;

  // Форматлагчид
  format: (mntValue: number) => string; // идэвхтэй валютын формат
  formatMNT: (mntValue: number) => string;
  formatUSD: (mntValue: number) => string; // MNT->USD хөрвүүлээд форматлана
  formatBoth: (mntValue: number) => { mntText: string; usdText: string };

  resetToDefault: () => void; // ENV default руу reset
};

const LS_RATE_KEY = "g07:usd_rate";
const LS_CURR_KEY = "g07:currency";

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({
  children,
  defaultRate = Number(process.env.NEXT_PUBLIC_USD_RATE || 3500),
  persist = false, // ⭐️ localStorage ашиглах эсэх
  syncTabs = true, // ⭐️ табууд хооронд синк хийх эсэх
}: {
  children: ReactNode;
  defaultRate?: number;
  persist?: boolean;
  syncTabs?: boolean;
}) {
  // ---------- State ----------
  const [currency, setCurrency] = useState<Currency>("MNT");
  const [rateMntPerUsd, setRate] = useState<number>(defaultRate);

  // ---------- Mount үед LS-сэргээх (persist=true үед л) ----------
  useEffect(() => {
    if (!persist) return;
    try {
      const savedRate = localStorage.getItem(LS_RATE_KEY);
      const savedCurr = localStorage.getItem(LS_CURR_KEY) as Currency | null;

      if (savedRate) {
        const n = Number(savedRate);
        if (Number.isFinite(n) && n > 0) setRate(n);
      }
      if (savedCurr === "MNT" || savedCurr === "USD") setCurrency(savedCurr);
    } catch {
      /* noop */
    }
  }, [persist]);

  // ---------- LS-д хадгалах (persist=true үед л) ----------
  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(LS_RATE_KEY, String(rateMntPerUsd));
    } catch {}
  }, [rateMntPerUsd, persist]);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(LS_CURR_KEY, currency);
    } catch {}
  }, [currency, persist]);

  // ---------- Табууд синк ----------
  useEffect(() => {
    if (!persist || !syncTabs) return;
    const handler = (e: StorageEvent) => {
      if (e.key === LS_RATE_KEY && e.newValue) {
        const n = Number(e.newValue);
        if (Number.isFinite(n) && n > 0) setRate(n);
      }
      if (e.key === LS_CURR_KEY && e.newValue) {
        const c = e.newValue as Currency;
        if (c === "MNT" || c === "USD") setCurrency(c);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [persist, syncTabs]);

  // ---------- Memo-той контекст утгууд ----------
  const value = useMemo<CurrencyContextType>(() => {
    const clamp2 = (n: number) => Math.round(n * 100) / 100;

    const convertToUSD = (mnt: number) =>
      rateMntPerUsd > 0 ? mnt / rateMntPerUsd : 0;

    const convertToMNT = (usd: number) => usd * rateMntPerUsd;

    const formatMNT = (mntValue: number) =>
      `₮${Number(mntValue).toLocaleString("mn-MN", {
        maximumFractionDigits: 0,
      })}`;

    const formatUSD = (mntValue: number) => {
      const usd = convertToUSD(mntValue);
      return `$${clamp2(usd).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const format = (mntValue: number) =>
      currency === "MNT" ? formatMNT(mntValue) : formatUSD(mntValue);

    const formatBoth = (mntValue: number) => ({
      mntText: formatMNT(mntValue),
      usdText: formatUSD(mntValue),
    });

    return {
      currency,
      rateMntPerUsd,
      setRateMntPerUsd: (n: number) => {
        // 1000–10000 хооронд зөвшөөрөх жишээ (хэт алдаанаас сэргийлэх)
        if (!Number.isFinite(n)) return;
        const clamped = Math.min(Math.max(n, 1000), 10000);
        setRate(clamped);
      },
      setCurrency,
      toggle: () => setCurrency((c) => (c === "MNT" ? "USD" : "MNT")),

      convertToUSD,
      convertToMNT,

      format,
      formatMNT,
      formatUSD,
      formatBoth,

      resetToDefault: () => setRate(defaultRate),
    };
  }, [currency, rateMntPerUsd, defaultRate]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
