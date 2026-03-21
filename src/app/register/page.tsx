"use client";

import React, { useState } from "react";
import { UserRound, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SKILL_OPTIONS, LANGUAGE_OPTIONS, STATE_OPTIONS } from "@/lib/mockData";
import Link from "next/link";

type Step = "role" | "aadhaar" | "profile" | "done";

export default function RegisterPage() {
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
    // Mock OTP send
    setTimeout(() => setIsVerifying(false), 1500);
  };

  const handleOtpVerify = () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    // Mock verification
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
        <h1 className="text-2xl font-bold tracking-tight mb-1">Shramik Setu</h1>
        <p className="text-[#bdc2ff] text-sm">
          {step === "role" && "Choose your role to get started"}
          {step === "aadhaar" && "Verify your identity with Aadhaar"}
          {step === "profile" && "Complete your profile"}
          {step === "done" && "Registration complete!"}
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
        {/* STEP 1: Role Selection */}
        {step === "role" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#343d96] mb-6">I am a...</h2>
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
                <h3 className="font-bold text-lg text-[#1a1c1d]">Worker / Labourer</h3>
                <p className="text-sm text-[#767683] mt-1">Find jobs, build your digital identity, access govt. schemes</p>
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
                <h3 className="font-bold text-lg text-[#1a1c1d]">Employer / Contractor</h3>
                <p className="text-sm text-[#767683] mt-1">Post jobs, find verified workers, manage your team</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#767683]" />
            </button>
          </div>
        )}

        {/* STEP 2: Aadhaar Verification */}
        {step === "aadhaar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#e0e0ff] p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-[#1A237E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Aadhaar Verification</h3>
                  <p className="text-xs text-[#767683]">Mock verification for demo</p>
                </div>
              </div>

              {!isVerified ? (
                <>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2 block">Aadhaar Number</label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="Enter 12-digit Aadhaar number"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3.5 text-lg tracking-[0.3em] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                    />
                  </div>

                  {aadhaar.length === 12 && (
                    <>
                      <button
                        onClick={handleAadhaarVerify}
                        disabled={isVerifying}
                        className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-3 rounded-xl font-medium mb-4 active:scale-95 transition-transform disabled:opacity-60"
                      >
                        {isVerifying ? "Sending OTP..." : "Send OTP"}
                      </button>

                      <div className="mb-4">
                        <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2 block">OTP Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3.5 text-xl tracking-[0.5em] font-mono text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all placeholder:text-sm placeholder:tracking-normal"
                        />
                      </div>

                      {otp.length === 6 && (
                        <button
                          onClick={handleOtpVerify}
                          disabled={isVerifying}
                          className="w-full bg-[#1B6D24] text-white py-3 rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-60"
                        >
                          {isVerifying ? "Verifying..." : "Verify OTP"}
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
                  <h3 className="font-bold text-xl text-[#1B6D24] mb-1">Identity Verified!</h3>
                  <p className="text-sm text-[#767683]">Aadhaar ****{aadhaar.slice(-4)} linked successfully</p>
                </div>
              )}
            </div>

            {!isVerified && (
              <button onClick={() => setStep("role")} className="text-sm text-[#767683] font-medium hover:underline mx-auto block">
                ← Back to role selection
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Profile Completion */}
        {step === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
              <h3 className="font-bold text-lg text-[#343d96]">Personal Info</h3>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(p => ({...p, state: e.target.value}))}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all appearance-none"
                  >
                    <option value="">Select</option>
                    {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">District</label>
                  <input
                    type="text"
                    placeholder="District"
                    value={formData.district}
                    onChange={(e) => setFormData(p => ({...p, district: e.target.value}))}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                  />
                </div>
              </div>

              {role === "employer" && (
                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Business Name</label>
                  <input
                    type="text"
                    placeholder="Company / Farm name"
                    value={formData.businessName}
                    onChange={(e) => setFormData(p => ({...p, businessName: e.target.value}))}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                  />
                </div>
              )}
            </div>

            {role === "worker" && (
              <>
                <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6">
                  <h3 className="font-bold text-lg text-[#343d96] mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                          formData.skills.includes(skill)
                            ? "bg-[#1A237E] text-white shadow-md"
                            : "bg-[#e8e8ea] text-[#454652] hover:bg-[#d9dadc]"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6">
                  <h3 className="font-bold text-lg text-[#343d96] mb-4">Languages Spoken</h3>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                          formData.languages.includes(lang)
                            ? "bg-[#1B6D24] text-white shadow-md"
                            : "bg-[#e8e8ea] text-[#454652] hover:bg-[#d9dadc]"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setStep("done")}
              disabled={!formData.name || !formData.state}
              className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
            >
              Complete Registration
            </button>
          </div>
        )}

        {/* STEP 4: Done */}
        {step === "done" && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="bg-[#a0f399]/30 p-6 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-[#1B6D24]" />
            </div>
            <h2 className="font-bold text-2xl text-[#1a1c1d] mb-2">Welcome, {formData.name || "User"}!</h2>
            <p className="text-[#767683] mb-8 max-w-xs">
              {role === "worker"
                ? "Your Digital Labour Card is ready. Explore matched jobs and government schemes."
                : "Your employer account is ready. Start posting jobs to find verified workers."
              }
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link
                href={role === "worker" ? "/" : "/employer"}
                className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg active:scale-95 transition-transform"
              >
                {role === "worker" ? "Go to Dashboard" : "Go to Employer Panel"}
              </Link>
              {role === "worker" && (
                <Link href="/card" className="w-full bg-white border-2 border-[#1A237E] text-[#1A237E] py-3 rounded-xl font-bold text-center active:scale-95 transition-transform">
                  View Digital Card
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
