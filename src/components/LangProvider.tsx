"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Language, t as i18nTranslate } from "@/lib/i18n";

type LangContextType = {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      setLangState(match[1] as Language);
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  const translate = useCallback((key: string) => i18nTranslate(key, lang), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLanguage, t: translate }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggle() {
  const { lang, setLanguage } = useLang();
  
  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center">
      <div className="relative">
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-white/90 backdrop-blur-xl px-4 py-2 pr-8 rounded-full shadow-lg border border-[#eeeef0] text-sm font-bold text-[#1A237E] cursor-pointer outline-none hover:bg-[#e0e0ff] transition-all"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231A237E%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
        </select>
      </div>
    </div>
  );
}
