"use client";
import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLang } from "@/components/LangProvider";
import { useUser } from "@/components/UserProvider";

export default function Login() {
  const router = useRouter();
  const { t } = useLang();
  const { login } = useUser();

  const [kycState, setKycState] = useState<"IDLE" | "OTP_SENT">("IDLE");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  const handleGenerateOTP = async () => {
    if (aadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/generate-otp", { aadhaar_number: aadhaar });
      // Save request_id if Sandbox returns one (used for OTP verification)
      if (res.data?.data?.request_id) {
        setRequestId(res.data.data.request_id);
      }
    } catch (err: any) {
      console.log("Sandbox OTP generate error (continuing for demo):", err?.response?.data);
    } finally {
      setKycState("OTP_SENT");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/verify-otp", {
        aadhaar_number: aadhaar,
        otp,
        request_id: requestId,
      });

      if (res.data?.success && res.data?.user) {
        // Save user into global context (and cookie is already set by the server)
        login(res.data.user);
        router.push("/");
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "OTP verification failed. Please check and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] flex flex-col font-sans">
      <div className="bg-[#1A237E] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("app_name")}</h1>
        <p className="text-[#bdc2ff] text-base">{t("verify_identity_login")}</p>
      </div>

      <main className="px-5 -mt-16 flex-1 flex flex-col items-center">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
          <h2 className="text-xl font-bold text-center text-[#1A237E] mb-6">{t("aadhaar_verification")}</h2>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {kycState === "IDLE" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("aadhaar_number")}</label>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => { setAadhaar(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] transition-all"
                />
              </div>
              <button
                onClick={handleGenerateOTP}
                disabled={loading}
                className="w-full bg-[#1A237E] text-white font-bold py-3 rounded-xl flex justify-center items-center hover:bg-[#000666] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("send_otp")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-sm text-blue-700 text-center">
                OTP sent to Aadhaar-linked mobile for <strong>XXXX XXXX {aadhaar.slice(-4)}</strong>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("enter_otp")}</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  autoFocus
                  onChange={(e) => { setOtp(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] transition-all tracking-[0.3em] text-lg font-bold text-center"
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-[#1B6D24] text-white font-bold py-3 rounded-xl flex justify-center items-center hover:bg-[#005312] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("verify_login")}
              </button>

              <button
                onClick={() => { setKycState("IDLE"); setError(""); setOtp(""); }}
                className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700 mt-2"
              >
                ← Wrong Aadhaar Number?
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
