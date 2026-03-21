"use client";

import React from "react";
import { Star, ShieldCheck, MapPin, Briefcase, Phone, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { mockWorker } from "@/lib/mockData";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/components/AuthProvider";

import { useRouter } from "next/navigation";

export default function DigitalCardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/register?role=worker");
    } else if (userProfile && userProfile.role === "employer") {
      router.push("/employer");
    }
  }, [user, userProfile, authLoading, router]);

  const worker = mockWorker; // fallback

  const displayName = userProfile?.name || user?.displayName || worker.name;
  const displayRole = userProfile?.skills?.[0] || worker.role;
  const displayLocation = userProfile?.district && userProfile?.state 
    ? `${userProfile.district}, ${userProfile.state.substring(0,2).toUpperCase()}` 
    : worker.location;
    
  const displayPhone = userProfile?.phone || user?.phoneNumber || worker.phone;
  const isAadhaarVerified = userProfile?.isAadhaarVerified || worker.isAadhaarVerified;
  const aadhaarLast4 = userProfile?.aadhaarLast4 || worker.aadhaarLast4;
  const skills = userProfile?.skills || worker.skills;
  const languages = userProfile?.languages || worker.languages;

  const cardUrl = typeof window !== 'undefined' ? `${window.location.origin}/card` : '';

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-12 pb-8 px-6 shadow-md rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Digital Labour Card</h1>
        <p className="text-[#bdc2ff] text-sm">Your portable worker identity</p>
      </div>

      <main className="px-5 -mt-4 space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-[0_12px_32px_rgba(26,35,126,0.1)] overflow-hidden">
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-[#000666] to-[#1A237E] p-5 flex justify-between items-center">
            <div>
              <p className="text-[#bdc2ff] text-[10px] font-bold uppercase tracking-[0.15em]">SHRAMIK SETU — DIGITAL LABOUR CARD</p>
              <p className="text-white text-lg font-bold mt-1">{displayName}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG value={cardUrl || user?.uid || worker.id} size={56} />
            </div>
          </div>

          {/* Card Details */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Role</p>
                <p className="font-bold text-[#1a1c1d]">{displayRole}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Location</p>
                <p className="font-bold text-[#1a1c1d] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#767683]" /> {displayLocation}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Rating</p>
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" /> {worker.rating}
                  <span className="text-xs text-[#767683] font-normal ml-1">({worker.jobsCompleted} jobs)</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Member Since</p>
                <p className="font-bold text-[#1a1c1d] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#767683]" /> {worker.createdAt}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Phone</p>
                <p className="font-bold text-[#1a1c1d] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#767683]" /> {displayPhone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-1">Aadhaar</p>
                <p className="font-bold text-[#1a1c1d]">{aadhaarLast4 ? `XXXX XXXX ${aadhaarLast4}` : "Not Linked"}</p>
              </div>
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="bg-[#e0e0ff] text-[#000666] text-xs font-bold px-3 py-1.5 rounded-lg">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#767683] uppercase tracking-[0.1em] mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <span key={lang} className="bg-[#f0f0f2] text-[#454652] text-xs font-bold px-3 py-1.5 rounded-lg">{lang}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Badge */}
            {isAadhaarVerified && (
              <div className="flex items-center gap-3 bg-[#a0f399]/20 text-[#005312] p-3 rounded-xl border border-[#a0f399]">
                <div className="bg-[#1B6D24] rounded-full p-1.5 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider uppercase">Identity Verified</p>
                  <p className="text-sm font-medium">Aadhaar e-KYC Linked</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work History */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-6">
          <h3 className="font-bold text-lg text-[#343d96] mb-4">Work History</h3>
          <div className="space-y-4">
            {worker.workHistory.map((entry, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-[#f0f0f2] p-2.5 rounded-full shrink-0">
                  <Briefcase className="w-5 h-5 text-[#1A237E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a1c1d] truncate">{entry.jobTitle}</p>
                  <p className="text-xs text-[#767683]">{entry.company} · {entry.durationDays} days · ₹{entry.wagePerDay}/day</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {entry.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
