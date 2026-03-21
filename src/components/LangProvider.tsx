"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Language, t } from "@/lib/i18n";

type LangContextType = {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  const translate = useCallback(
    (key: string) => t(key, lang),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translate }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// Floating language toggle button component
export function LangToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-[60] bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-lg border border-[#eeeef0] text-sm font-bold text-[#1A237E] hover:bg-[#e0e0ff] transition-all active:scale-90"
      title="Switch language"
    >
      {lang === "en" ? "हिंदी" : "ENG"}
    </button>
  );
}
