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
  rateMntPerUsd: number; // 1 USD = N MNT
  setRateMntPerUsd: (n: number) => void;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  format: (mntValue: number) => string; // идэвхтэй валютын форматын текст
  formatBoth: (mntValue: number) => {
    // зэрэг харуулахад хэрэгтэй
    mntText: string;
    usdText: string;
  };
  resetToDefault: () => void; // ENV default руу reset хийх
};

const LS_RATE_KEY = "g07:usd_rate";
const LS_CURR_KEY = "g07:currency";

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({
  children,
  defaultRate = Number(process.env.NEXT_PUBLIC_USD_RATE || 3500),
}: {
  children: ReactNode;
  defaultRate?: number;
}) {
  // ------- initial (client-only) -------
  const [currency, setCurrency] = useState<Currency>("MNT");
  const [rateMntPerUsd, setRate] = useState<number>(defaultRate);

  // localStorage-оос сэргээх
  useEffect(() => {
    try {
      const savedRate = localStorage.getItem(LS_RATE_KEY);
      const savedCurr = localStorage.getItem(LS_CURR_KEY) as Currency | null;

      if (savedRate) {
        const n = Number(savedRate);
        if (!Number.isNaN(n) && n > 0) setRate(n);
      }
      if (savedCurr === "MNT" || savedCurr === "USD") setCurrency(savedCurr);
    } catch {}
  }, []);

  // localStorage-д хадгалах
  useEffect(() => {
    try {
      localStorage.setItem(LS_RATE_KEY, String(rateMntPerUsd));
    } catch {}
  }, [rateMntPerUsd]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_CURR_KEY, currency);
    } catch {}
  }, [currency]);

  const value = useMemo<CurrencyContextType>(() => {
    const toMnt = (n: number) =>
      `₮${Number(n).toLocaleString("mn-MN", { maximumFractionDigits: 0 })}`;
    const toUsd = (mnt: number) => {
      const usd = rateMntPerUsd > 0 ? mnt / rateMntPerUsd : 0;
      return `$${usd.toFixed(2)}`;
    };

    const format = (mntValue: number) =>
      currency === "MNT" ? toMnt(mntValue) : toUsd(mntValue);

    const formatBoth = (mntValue: number) => ({
      mntText: toMnt(mntValue),
      usdText: toUsd(mntValue),
    });

    return {
      currency,
      rateMntPerUsd,
      setRateMntPerUsd: (n: number) => {
        if (Number.isFinite(n) && n > 0) setRate(n);
      },
      setCurrency,
      toggle: () => setCurrency((c) => (c === "MNT" ? "USD" : "MNT")),
      format,
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
