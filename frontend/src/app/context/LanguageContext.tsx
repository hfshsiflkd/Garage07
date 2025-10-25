"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Lang = "mn" | "en";
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  children,
  defaultLang = "mn",
}: {
  children: React.ReactNode;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === "mn" ? "en" : "mn")),
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
