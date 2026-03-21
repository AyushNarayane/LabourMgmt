"use client";
import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' }
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Check for existing translation state
    const match = document.cookie.match(/googtrans=\/en\/([a-z-]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    // Initialize Google API silently
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGES.map(l => l.code).join(','),
            autoDisplay: false
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    setCurrentLang(langCode);
    
    // Explicitly write the translation cookie
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    
    // Force DOM translation update
    window.location.reload();
  };

  return (
    <>
      {/* Target for the Google script to bind to (Hidden completely) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Our Custom Beautiful UI */}
      <div className="fixed top-4 right-4 z-[9999] bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#e0e0f0] flex items-center pr-2 pl-3 py-1.5 gap-2 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] hover:-translate-y-0.5 group cursor-pointer overflow-hidden">
        
        <Globe className="w-4 h-4 text-[#1A237E] group-hover:rotate-12 transition-transform flex-shrink-0" />
        
        <select 
          value={currentLang}
          onChange={handleLanguageChange}
          className="appearance-none bg-transparent outline-none cursor-pointer text-sm font-bold text-[#1A237E] pr-6 py-1 border-none focus:ring-0"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231A237E%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '0.65rem auto' }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.native} ({lang.name})
            </option>
          ))}
        </select>
        
        {/* CSS rules to forcefully neutralize Google's structural injections */}
        <style dangerouslySetInnerHTML={{__html: `
          body { top: 0px !important; position: static !important; }
          .skiptranslate.goog-te-banner-frame { display: none !important; }
          #goog-gt-tt { display: none !important; }
        `}} />
      </div>
    </>
  );
}
