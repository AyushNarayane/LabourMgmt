"use client";

import React, { useState } from "react";
import { UserRound, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SKILL_OPTIONS, LANGUAGE_OPTIONS, STATE_OPTIONS } from "@/lib/mockData";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";

type Step = "role" | "aadhaar" | "profile" | "done";

export default function RegisterPage() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<"worker" | "employer" | null>(null);
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    district: "",
    skills: [] as string[],
    languages: [] as string[],
    businessName: "",
  });

  const handleAadhaarVerify = () => {
    if (aadhaar.length !== 12) return;
    setIsVerifying(true);
    setTimeout(() => setIsVerifying(false), 1500);
  };

  const handleOtpVerify = () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
      setTimeout(() => setStep("profile"), 800);
    }, 1500);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-14 pb-10 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t("app_name")}</h1>
        <p className="text-[#bdc2ff] text-sm">
          {step === "role" && t("choose_role")}
          {step === "aadhaar" && t("verify_aadhaar_short")}
          {step === "profile" && t("complete_profile")}
          {step === "done" && t("registration_complete")}
        </p>
        {/* Progress bar */}
        <div className="flex gap-2 mt-6">
          {["role", "aadhaar", "profile", "done"].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              ["role", "aadhaar", "profile", "done"].indexOf(step) >= i
                ? "bg-white" : "bg-white/20"
            }`} />
          ))}
        </div>
      </div>

      <main className="px-5 py-8">
        {step === "role" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#343d96] mb-6">{t("i_am_a")}</h2>
            <button
              onClick={() => { setRole("worker"); setStep("aadhaar"); }}
              className={`w-full bg-white rounded-2xl p-6 flex items-center gap-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border-2 transition-all active:scale-[0.98] ${
                role === "worker" ? "border-[#1A237E]" : "border-transparent hover:border-[#c6c5d4]"
              }`}
            >
              <div className="bg-[#e0e0ff] p-4 rounded-full">
                <UserRound className="w-8 h-8 text-[#1A237E]" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-[#1a1c1d]">{t("worker_labourer")}</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-[#767683]" />
            </button>

            <button
              onClick={() => { setRole("employer"); setStep("aadhaar"); }}
              className={`w-full bg-white rounded-2xl p-6 flex items-center gap-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border-2 transition-all active:scale-[0.98] ${
                role === "employer" ? "border-[#1A237E]" : "border-transparent hover:border-[#c6c5d4]"
              }`}
            >
              <div className="bg-[#a0f399]/30 p-4 rounded-full">
                <Building2 className="w-8 h-8 text-[#1B6D24]" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-[#1a1c1d]">{t("employer_contractor")}</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-[#767683]" />
            </button>
          </div>
        )}

        {step === "aadhaar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#e0e0ff] p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-[#1A237E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t("aadhaar_verification")}</h3>
                </div>
              </div>

              {!isVerified ? (
                <>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2 block">{t("aadhaar_number")}</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3.5 text-lg tracking-[0.3em] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                    />
                  </div>

                  {aadhaar.length === 12 && (
                    <>
                      <button
                        onClick={handleAadhaarVerify}
                        disabled={isVerifying}
                        className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-3 rounded-xl font-medium mb-4 active:scale-95 transition-transform disabled:opacity-60"
                      >
                        {isVerifying ? "..." : t("send_otp")}
                      </button>

                      <div className="mb-4">
                        <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2 block">{t("enter_otp")}</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3.5 text-xl tracking-[0.5em] font-mono text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                        />
                      </div>

                      {otp.length === 6 && (
                        <button
                          onClick={handleOtpVerify}
                          disabled={isVerifying}
                          className="w-full bg-[#1B6D24] text-white py-3 rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-60"
                        >
                          {isVerifying ? "..." : t("verify_login")}
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="bg-[#a0f399]/30 p-4 rounded-full mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-[#1B6D24]" />
                  </div>
                  <h3 className="font-bold text-xl text-[#1B6D24] mb-1">{t("identity_verified")}</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
              <h3 className="font-bold text-lg text-[#343d96]">{t("personal_info")}</h3>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">{t("full_name")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">{t("phone_number")}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">{t("state")}</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(p => ({...p, state: e.target.value}))}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all appearance-none"
                  >
                    <option value="">--</option>
                    {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData(p => ({...p, district: e.target.value}))}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep("done")}
              disabled={!formData.name || !formData.state}
              className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
            >
              {t("complete_registration")}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="bg-[#a0f399]/30 p-6 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-[#1B6D24]" />
            </div>
            <h2 className="font-bold text-2xl text-[#1a1c1d] mb-2">{t("registration_complete")}</h2>
            <div className="flex flex-col gap-3 w-full mt-8">
              <Link
                href={role === "worker" ? "/" : "/employer"}
                className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg active:scale-95 transition-transform"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
