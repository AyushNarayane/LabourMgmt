"use client";

import React, { useState, useEffect } from "react";
import { UserRound, Building2, ArrowRight, ShieldCheck, CheckCircle2, Mail, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { SKILL_OPTIONS, LANGUAGE_OPTIONS, STATE_OPTIONS } from "@/lib/mockData";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Step = "role" | "auth" | "profile" | "done";
type AuthMethod = "email" | "phone" | null;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialRole = (searchParams.get("role") as "worker" | "employer") || null;
  const initialLogin = searchParams.get("login") === "true";
  const {
    user,
    userProfile,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    error: authError,
    clearError,
    saveProfile,
    loading: authLoading,
  } = useAuth();

  const [step, setStep] = useState<Step>(initialRole ? "auth" : "role");
  const [role, setRole] = useState<"worker" | "employer" | null>(initialRole);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [isLogin, setIsLogin] = useState(initialLogin);

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<unknown>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Profile fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    district: "",
    skills: [] as string[],
    languages: [] as string[],
    businessName: "",
    aadhaarLast4: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect upon successful login
  useEffect(() => {
    if (userProfile && isLogin) {
      router.push(userProfile.role === "worker" ? "/worker" : "/employer");
    }
  }, [userProfile, isLogin, router]);

  // ------ EMAIL SIGN UP / SIGN IN ------
  const handleEmailAuth = async () => {
    if (!email || !password) return;
    setIsSubmitting(true);
    clearError();
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        // routing is handled by the useEffect watching userProfile!
      } else {
        await signUpWithEmail(email, password, formData.name || email.split("@")[0], role!, {
          state: formData.state,
          district: formData.district,
        });
        setStep("profile");
      }
    } catch {
      // error is handled by AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------ GOOGLE SIGN IN ------
  const handleGoogleSignIn = async () => {
    if (!role) return;
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithGoogle(role);
      setStep("profile");
    } catch {
      // error is handled by AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------ PHONE OTP ------
  const handleSendOtp = async () => {
    if (!phoneNumber) return;
    setIsSubmitting(true);
    clearError();
    try {
      const formatted = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      const result = await sendPhoneOtp(formatted, "recaptcha-container");
      if (result) {
        setConfirmationResult(result);
        setOtpSent(true);
      }
    } catch {
      // error handled in provider
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setIsSubmitting(true);
    clearError();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await verifyPhoneOtp(confirmationResult as any, otp, role!, { name: formData.name });
      setStep("profile");
    } catch {
      // error handled in provider
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------ PROFILE COMPLETION ------
  const handleCompleteProfile = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.name || user?.displayName || "User",
        role: role!,
        state: formData.state,
        district: formData.district,
        isAadhaarVerified: formData.aadhaarLast4.length === 4,
      };

      if (formData.phone || user?.phoneNumber) payload.phone = formData.phone || user?.phoneNumber;
      if (role === "worker") {
        payload.skills = formData.skills;
        payload.languages = formData.languages;
      } else {
        payload.businessName = formData.businessName;
      }
      if (formData.aadhaarLast4) payload.aadhaarLast4 = formData.aadhaarLast4;

      await saveProfile(payload);
      setStep("done");
    } catch (err) {
      console.error("Profile save failed:", err);
    } finally {
      setIsSubmitting(false);
    }
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
          {step === "auth" && (isLogin ? "Sign in to your account" : "Create your account")}
          {step === "profile" && "Complete your profile"}
          {step === "done" && "Registration complete!"}
        </p>
        {/* Progress bar */}
        <div className="flex gap-2 mt-6">
          {["role", "auth", "profile", "done"].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              ["role", "auth", "profile", "done"].indexOf(step) >= i
                ? "bg-white" : "bg-white/20"
            }`} />
          ))}
        </div>
      </div>

      <main className="px-5 py-8">
        {/* Error Banner */}
        {authError && (
          <div className="bg-[#ffdad6] border border-[#ffdad6] text-[#93000a] rounded-xl p-4 mb-6 text-sm font-medium">
            {authError}
            <button onClick={clearError} className="float-right font-bold">✕</button>
          </div>
        )}

        {/* ===== STEP 1: Role Selection ===== */}
        {step === "role" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#343d96] mb-6">I am a...</h2>
            <button
              onClick={() => { setRole("worker"); setStep("auth"); }}
              className="w-full bg-white rounded-2xl p-6 flex items-center gap-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border-2 border-transparent hover:border-[#c6c5d4] transition-all active:scale-[0.98]"
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
              onClick={() => { setRole("employer"); setStep("auth"); }}
              className="w-full bg-white rounded-2xl p-6 flex items-center gap-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border-2 border-transparent hover:border-[#c6c5d4] transition-all active:scale-[0.98]"
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

            <p className="text-center text-sm text-[#767683] mt-4">
              Already have an account?{" "}
              <button onClick={() => { setIsLogin(true); setStep("auth"); }} className="text-[#1A237E] font-bold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* ===== STEP 2: Authentication ===== */}
        {step === "auth" && (
          <div className="space-y-6">
            {/* Auth Method Chooser */}
            {!authMethod && !isLogin && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#343d96] mb-4">Choose sign-up method</h2>

                <button
                  onClick={() => setAuthMethod("email")}
                  className="w-full bg-white rounded-xl p-5 flex items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] active:scale-[0.98] transition-all"
                >
                  <div className="bg-[#e0e0ff] p-3 rounded-full"><Mail className="w-5 h-5 text-[#1A237E]" /></div>
                  <div className="text-left"><p className="font-bold">Email & Password</p><p className="text-xs text-[#767683]">Register with your email</p></div>
                </button>

                <button
                  onClick={() => setAuthMethod("phone")}
                  className="w-full bg-white rounded-xl p-5 flex items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] active:scale-[0.98] transition-all"
                >
                  <div className="bg-[#a0f399]/30 p-3 rounded-full"><Phone className="w-5 h-5 text-[#1B6D24]" /></div>
                  <div className="text-left"><p className="font-bold">Phone Number (OTP)</p><p className="text-xs text-[#767683]">Best for feature-phone workers</p></div>
                </button>

                <div className="relative flex items-center my-6">
                  <div className="flex-1 border-t border-[#d9dadc]" />
                  <span className="px-4 text-xs text-[#767683] font-bold uppercase tracking-wider">or</span>
                  <div className="flex-1 border-t border-[#d9dadc]" />
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] font-bold text-[#454652] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Email/Password Form */}
            {(authMethod === "email" || isLogin) && (
              <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
                <h3 className="font-bold text-lg text-[#343d96]">{isLogin ? "Sign In" : "Create Account"}</h3>

                {!isLogin && (
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
                )}

                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 pr-12 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767683]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEmailAuth}
                  disabled={isSubmitting || !email || !password}
                  className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-3.5 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isLogin ? "Sign In" : "Create Account"}
                </button>

                <p className="text-center text-sm text-[#767683]">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => { setIsLogin(!isLogin); clearError(); }}
                    className="text-[#1A237E] font-bold hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}

            {/* Phone OTP Form */}
            {authMethod === "phone" && !isLogin && (
              <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#a0f399]/30 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-[#1B6D24]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phone Verification</h3>
                    <p className="text-xs text-[#767683]">We&apos;ll send you an OTP via SMS</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="bg-[#e8e8ea] rounded-xl px-4 py-3 text-[#454652] font-bold">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-[#e8e8ea] rounded-xl px-4 py-3 text-lg tracking-wider font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={isSubmitting || phoneNumber.length !== 10}
                    className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-3 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Send OTP
                  </button>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">OTP Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 text-2xl tracking-[0.5em] font-mono text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isSubmitting || otp.length !== 6}
                      className="w-full bg-[#1B6D24] text-white py-3 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      Verify & Continue
                    </button>
                  </>
                )}

                {/* reCAPTCHA container (invisible) */}
                <div id="recaptcha-container" />
              </div>
            )}

            {/* Back button */}
            {!isLogin && (
              <button onClick={() => { setStep("role"); setAuthMethod(null); clearError(); }} className="text-sm text-[#767683] font-medium hover:underline mx-auto block mt-4">
                ← Back to role selection
              </button>
            )}
            {isLogin && (
              <button onClick={() => { setIsLogin(false); setStep("role"); clearError(); }} className="text-sm text-[#767683] font-medium hover:underline mx-auto block mt-4">
                ← Back to role selection
              </button>
            )}
          </div>
        )}

        {/* ===== STEP 3: Profile Completion ===== */}
        {step === "profile" && (
          <div className="space-y-6">
            {/* Logged-in indicator */}
            {user && (
              <div className="bg-[#a0f399]/20 border border-[#a0f399] p-3 rounded-xl flex items-center gap-3 text-[#005312]">
                <CheckCircle2 className="w-5 h-5 text-[#1B6D24]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-medium">{user.email || user.phoneNumber || user.displayName}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
              <h3 className="font-bold text-lg text-[#343d96]">Personal Info</h3>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name || user?.displayName || ""}
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91"
                  value={formData.phone || user?.phoneNumber || ""}
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

              {/* Aadhaar mock field */}
              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Aadhaar Last 4 Digits (optional)</label>
                <div className="flex items-center gap-2">
                  <span className="text-[#767683] font-mono">XXXX XXXX</span>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData(p => ({...p, aadhaarLast4: e.target.value.replace(/\D/g, "")}))}
                    className="w-24 bg-[#e8e8ea] rounded-xl px-4 py-3 text-center font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                  />
                  {formData.aadhaarLast4.length === 4 && (
                    <ShieldCheck className="w-5 h-5 text-[#1B6D24]" />
                  )}
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
              onClick={handleCompleteProfile}
              disabled={isSubmitting || (!formData.name && !user?.displayName) || !formData.state}
              className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Complete Registration
            </button>
          </div>
        )}

        {/* ===== STEP 4: Done ===== */}
        {step === "done" && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="bg-[#a0f399]/30 p-6 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-[#1B6D24]" />
            </div>
            <h2 className="font-bold text-2xl text-[#1a1c1d] mb-2">
              Welcome, {formData.name || user?.displayName || "User"}!
            </h2>
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
