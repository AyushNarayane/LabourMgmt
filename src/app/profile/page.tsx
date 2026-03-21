"use client";

import React from "react";
import { ArrowLeft, Star, MapPin, Phone, Calendar, Briefcase, ShieldCheck, BookOpen, Settings } from "lucide-react";
import { mockWorker, mockSchemes } from "@/lib/mockData";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/register?role=worker");
    }
  }, [user, authLoading, router]);

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

  const eligibleCount = mockSchemes.filter(s => s.isEligible).length;

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-12 pb-20 px-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30 text-3xl font-bold">
            {displayName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-[#bdc2ff] text-sm flex items-center gap-1.5 mt-1">
              {displayRole} · <MapPin className="w-3.5 h-3.5" /> {displayLocation}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{worker.rating}</span>
              <span className="text-xs text-[#bdc2ff] ml-1">({worker.jobsCompleted} jobs done)</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-5 -mt-10 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 text-center border border-[#eeeef0]">
            <p className="text-2xl font-bold text-[#1A237E]">{worker.jobsCompleted}</p>
            <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider mt-1">Jobs Done</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 text-center border border-[#eeeef0]">
            <p className="text-2xl font-bold text-amber-500">{worker.rating}</p>
            <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider mt-1">Rating</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 text-center border border-[#eeeef0]">
            <p className="text-2xl font-bold text-[#1B6D24]">{eligibleCount}</p>
            <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider mt-1">Schemes</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-6 space-y-4">
          <h3 className="font-bold text-[#343d96]">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#767683]" />
              <span className="text-sm">{displayPhone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#767683]" />
              <span className="text-sm">Member since {worker.createdAt}</span>
            </div>
            {isAadhaarVerified && (
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#1B6D24]" />
                <span className="text-sm font-medium text-[#005312]">Aadhaar Verified ({aadhaarLast4 ? `****${aadhaarLast4}` : "Linked"})</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-6">
            <h3 className="font-bold text-[#343d96] mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-[#e0e0ff] text-[#000666] text-sm font-bold px-4 py-2 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-6">
            <h3 className="font-bold text-[#343d96] mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <span key={lang} className="bg-[#f0f0f2] text-[#454652] text-sm font-bold px-4 py-2 rounded-full">{lang}</span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="space-y-3">
          <Link href="/card" className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-4 flex items-center gap-4 active:scale-[0.99] transition-transform">
            <div className="bg-[#e0e0ff] p-2.5 rounded-full"><Briefcase className="w-5 h-5 text-[#1A237E]" /></div>
            <div className="flex-1"><p className="font-bold">Digital Labour Card</p><p className="text-xs text-[#767683]">View & share your card</p></div>
          </Link>
          <Link href="/schemes" className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-4 flex items-center gap-4 active:scale-[0.99] transition-transform">
            <div className="bg-[#a0f399]/30 p-2.5 rounded-full"><BookOpen className="w-5 h-5 text-[#1B6D24]" /></div>
            <div className="flex-1"><p className="font-bold">Government Schemes</p><p className="text-xs text-[#767683]">{eligibleCount} schemes you are eligible for</p></div>
          </Link>
        </div>
      </main>
    </div>
  );
}
