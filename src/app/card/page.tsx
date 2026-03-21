"use client";

import React, { useEffect } from "react";
import { Star, ShieldCheck, MapPin, Briefcase, Calendar, ArrowLeft, Share2, CheckCircle2, FileCheck2, Camera, User } from "lucide-react";
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
    
  const isAadhaarVerified = userProfile?.isAadhaarVerified || worker.isAadhaarVerified;
  const aadhaarLast4 = userProfile?.aadhaarLast4 || worker.aadhaarLast4;
  const skills = userProfile?.skills || worker.skills;

  const uniqueId = user?.uid || worker.id;
  const cardUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${uniqueId}` : '';

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1a1c1d] pb-24 font-sans antialiased">
      {/* Official State Header */}
      <div className="bg-white border-b border-[#e2e2e2] pt-14 pb-10 px-6 relative overflow-hidden shadow-sm">
        {/* Patriotic Tricolor Strip - Sovereign Branding */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>
        
        {/* Security Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000666 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }}></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <Link href="/" className="p-2 -ml-2 hover:bg-[#f3f3f3] rounded-full transition-all">
            <ArrowLeft className="w-6 h-6 text-[#000666]" />
          </Link>
          <button className="flex items-center gap-2 bg-[#000666]/5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-[#000666] hover:bg-[#000666]/10 transition-all border border-[#000666]/10">
            <Share2 className="w-4 h-4" />
            Share Identity
          </button>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight text-[#000666] font-lexend">Universal Labour Identity</h1>
          <p className="text-[#454652] text-sm font-medium mt-1">Republic of India · Digital Workforce Registry</p>
        </div>
      </div>

      <main className="px-5 mt-8 space-y-8">
        {/* Main Sovereign Card */}
        <div className="bg-white rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,6,102,0.12)] border border-[#e2e2e2] overflow-hidden relative">
          {/* Internal Security mesh (Watermark style) */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000666 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Card Top Banner - Official Sovereign Blue Gradient */}
          <div className="bg-gradient-to-br from-[#000666] via-[#000666] to-[#1a237e] p-7 flex justify-between items-center relative overflow-hidden">
             {/* Glossy Identity Overlay */}
             <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
             {/* Security seal flourish */}
             <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full border border-white/10"></div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-white/15 p-1.5 rounded backdrop-blur-md border border-white/10">
                   <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em] font-lexend">Shramik identity</p>
              </div>
              <p className="text-white text-2xl font-black mt-1 tracking-tight font-lexend">{displayName}</p>
            </div>

            {/* Empty Profile Image Placeholder - Sovereign Depth Style */}
            <div className="relative z-20 -mb-16 mr-2">
               <div className="w-[110px] h-[110px] rounded-[20px] bg-[#f8fafc] border-[4px] border-white shadow-[0_12px_24px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden group transition-all hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#000666]/5"></div>
                  <div className="flex flex-col items-center gap-1.5 text-[#94a3b8] group-hover:text-[#000666] transition-colors">
                     <Camera className="w-7 h-7 opacity-20" />
                     <User className="w-8 h-8" />
                  </div>
               </div>
            </div>
          </div>

          {/* Card Details - Sovereign Tonal Shifts */}
          <div className="p-7 space-y-7">
            <div className="grid grid-cols-2 gap-y-7 gap-x-8 relative z-10">
              <div>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1.5">Occupation</p>
                <p className="font-black text-[#000666] text-lg font-lexend">{displayRole}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1.5">Working In</p>
                <p className="font-black text-[#000666] flex items-center gap-1.5 font-lexend">
                  <MapPin className="w-4 h-4 text-[#8f4e00]" /> {displayLocation}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1.5">Vetted Performance</p>
                <div className="flex items-center gap-1.5 font-extrabold text-[#bd7500]">
                  <Star className="w-4 h-4 fill-[#fe9832] text-[#fe9832]" /> {worker.rating}
                  <span className="text-[10px] text-[#94a3b8] font-black ml-1 uppercase">({worker.jobsCompleted} Task Logs)</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1.5">Registry Date</p>
                <p className="font-black text-[#000666] flex items-center gap-1.5 font-lexend">
                  <Calendar className="w-4 h-4 text-[#000666]" /> {worker.createdAt}
                </p>
              </div>
            </div>

            {/* Sovereign Identity Footer with Premium QR */}
            <div className="pt-8 border-t border-[#e2e2e2] flex justify-between items-end gap-2">
               <div className="flex-1">
                 <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-2.5">Official Aadhaar Identity Number</p>
                 <p className="text-3xl font-black text-[#000666] tracking-[0.2em] font-mono mb-3 leading-none">
                   {aadhaarLast4 ? `XXXX XXXX ${aadhaarLast4}` : "XXXX XXXX XXXX"}
                 </p>
                 <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-[0.1em]">Validity</p>
                      <p className="text-xs font-black text-[#000666]">DEC 2030</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-[0.1em]">Identity Status</p>
                      <p className="text-xs font-black text-green-700 uppercase flex items-center gap-1">
                         <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </p>
                    </div>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-2 mb-[-4px]">
                  <div className="bg-white p-2.5 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#eeeeee]">
                    <QRCodeSVG 
                      value={cardUrl} 
                      size={90} 
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[8px] font-black text-[#1a237e] uppercase tracking-[0.2em]">Scan to verify</p>
               </div>
            </div>

            {/* Vetting Badges */}
            <div className="flex flex-wrap gap-2.5 pt-4">
               <div className="inline-flex items-center gap-2 bg-[#012100]/5 text-[#012100] px-3.5 py-1.5 rounded-full border border-[#012100]/10">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Aadhaar Authenticated</span>
               </div>
               <div className="inline-flex items-center gap-2 bg-[#000666]/5 text-[#000666] px-3.5 py-1.5 rounded-full border border-[#000666]/10">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Skills Certified</span>
               </div>
            </div>
          </div>
        </div>

        {/* Verification Status - Detached Banner */}
        {isAadhaarVerified && (
          <div className="bg-[#000666] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden flex items-center gap-5 border border-white/10">
            {/* Background flourish */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            
            <div className="bg-white/10 p-3 rounded-full border border-white/20 shadow-inner">
               <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/70">Registry Status</p>
               <p className="text-lg font-black font-lexend">Digitally Verified Identity</p>
               <p className="text-white/60 text-xs mt-0.5 font-medium tracking-tight">Accessing official welfare & priority job matching enabled.</p>
            </div>
          </div>
        )}

        {/* Work History Section - Editorial Professionalism styling */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e2e2] p-7">
          <h3 className="font-black text-xl text-[#000666] mb-6 flex items-center gap-3 font-lexend">
            <Briefcase className="w-6 h-6 text-[#8f4e00]" /> Employment Logs
          </h3>
          <div className="space-y-6">
            {worker.workHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-[#f5f5f7] p-3 rounded-xl border border-[#eeeeee] shrink-0 shadow-inner">
                  <Briefcase className="w-5 h-5 text-[#000666]" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-[#000666] uppercase text-xs tracking-wide truncate pr-4">{entry.jobTitle}</p>
                    <div className="flex items-center gap-1 text-[#bd7500] text-sm font-black shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#fe9832] text-[#fe9832]" /> {entry.rating}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#454652] mt-1">{entry.company}</p>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-tight mt-1">{entry.durationDays} days · Logged {entry.completedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
