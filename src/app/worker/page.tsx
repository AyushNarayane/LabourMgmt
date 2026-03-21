"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, MapPin, IndianRupee, Briefcase, ChevronRight, FileCheck2, Camera, User, CheckCircle2, LogOut, LogIn } from "lucide-react";
import { mockWorker, mockJobs, mockSchemes, Job } from "@/lib/mockData";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useLang } from "@/components/LangProvider";
import { useAuth } from "@/components/AuthProvider";
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  const worker = mockWorker; // Fallback structure
  const { t } = useLang();
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/register?role=worker");
    }
  }, [user, authLoading, router]);

  // Construct worker display data
  const displayName = userProfile?.name || user?.displayName || worker.name;
  const displayRole = userProfile?.skills?.[0] || worker.role;
  const displayLocation = userProfile?.district && userProfile?.state 
    ? `${userProfile.district}, ${userProfile.state.substring(0,2).toUpperCase()}` 
    : worker.location;
  const isAadhaarVerified = userProfile?.isAadhaarVerified || worker.isAadhaarVerified;
  
  const isLoggedIn = !!user;

  // Fetch Jobs from Firestore
  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobsRef = collection(db, "jobs");
        const jobsSnapshot = await getDocs(jobsRef);
        const fbJobs: Job[] = [];
        jobsSnapshot.forEach((doc) => {
          fbJobs.push({ id: doc.id, ...doc.data() } as Job);
        });
        // If Firestore is empty, fallback to mock data for demo
        setJobs(fbJobs.length > 0 ? fbJobs : mockJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs(mockJobs); // fallback
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const handleAcceptJob = (jobId: string) => {
    // Optimistic UI update - in a real app, write to Firestore
    setJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === jobId ? { ...job, status: "accepted" } : job
      )
    );
  };

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-20 font-sans">
      {/* Top Section / Header */}
      <div className="bg-[#3B4F8C] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight mb-1 font-lexend">{t("app_name")}</h1>
            <p className="text-[#bdc2ff] text-sm font-medium">{t("app_tagline")}</p>
          </div>
          {isLoggedIn ? (
            <button onClick={() => signOut()} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/10 backdrop-blur-md">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          ) : (
            <Link href="/register" className="flex items-center gap-2 bg-white/25 hover:bg-white/35 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-md">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-5 -mt-16 space-y-8">
        
        {/* Digital Labour Card */}
        <section>
          <div className="bg-[#fbfcff] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e2e8f0] p-6 relative overflow-hidden">
             {/* Subtle mesh pattern */}
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#3B4F8C 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            <Link href="/card" className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden border border-[#000666]/10 shadow-inner group transition-all hover:scale-[1.05]">
                  <div className="flex flex-col items-center gap-0.5 text-[#94a3b8]">
                     <Camera className="w-3.5 h-3.5 opacity-20" />
                     <User className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#000666] font-lexend">{displayName}</h2>
                  <p className="text-[#64748b] font-black text-[10px] flex items-center gap-1 uppercase tracking-[0.1em]">
                    {displayRole} <span className="text-[#cbd5e1]">•</span> {displayLocation}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-sm font-black text-[#bd7500]">
                    <Star className="w-4 h-4 fill-[#fe9832] text-[#fe9832]" />
                    <span className="font-lexend">{worker.rating}</span>
                    <span className="text-[10px] text-[#94a3b8] font-black ml-1 uppercase tracking-tighter">({worker.jobsCompleted} Logs)</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between gap-4 pt-5 border-t border-dashed border-[#e2e2e2] relative z-10">
              <div className="flex-1">
                 <p className="text-[9px] font-black tracking-[0.1em] uppercase text-[#94a3b8] mb-1.5">Sovereign Identity</p>
                 <p className="text-xl font-black text-[#000666] tracking-[0.25em] font-mono leading-none">
                   XXXX {worker.aadhaarLast4 || "####"}
                 </p>
              </div>
              <div className="bg-white p-1 rounded-[10px] border border-[#000666]/10 shadow-sm">
                 <QRCodeSVG 
                    value={typeof window !== 'undefined' ? `${window.location.host}/verify/${user?.uid || worker.id}` : ''} 
                    size={42} 
                 />
              </div>
            </div>

            {isAadhaarVerified && (
              <div className="flex items-center gap-3 bg-[#f0f9ff] text-[#1e40af] p-3 rounded-xl border border-[#bee3f8] relative z-10">
                <div className="bg-[#3B4F8C] rounded-full p-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-extrabold tracking-wider uppercase text-[#3B4F8C]">{t("verified_identity")}</p>
                  <p className="text-sm font-bold">{t("aadhaar_linked")}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Matched Jobs Section */}
        <section>
          <div className="flex justify-between items-end mb-5 px-1">
            <h3 className="text-lg font-black text-[#000666] flex items-center gap-2.5 font-lexend">
              <Briefcase className="w-5 h-5 text-[#8f4e00]" /> {t("matched_jobs")}
            </h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x hide-scrollbar">
            {jobs.map((job) => (
              <div key={job.id} className="min-w-[260px] max-w-[260px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 snap-start border border-[#eeeef0] flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#1a1c1d] break-words flex-1 pr-2 leading-tight">{job.title}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ml-auto shrink-0 ${job.matchScore >= 80 ? 'bg-[#e0e0ff] text-[#000666]' : 'bg-[#f0f0f2] text-[#454652]'}`}>
                    {job.matchScore}% {t("match")}
                  </span>
                </div>
                <p className="text-sm text-[#454652] mb-4 line-clamp-1">{job.company}</p>
                
                <div className="flex flex-col gap-2 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#454652]">
                    <MapPin className="w-4 h-4 text-[#767683]" />
                    <span>{job.distanceKm} {t("km_away")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#454652]">
                    <Briefcase className="w-4 h-4 text-[#767683]" />
                    <span>{job.durationDays} {t("days_req")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1B6D24]">
                    <IndianRupee className="w-4 h-4" />
                    <span>{job.wagePerDay} {t("per_day")}</span>
                  </div>
                </div>
                
                {job.status === "open" ? (
                  job.matchScore >= 80 ? (
                    <button 
                      onClick={() => handleAcceptJob(job.id)}
                      className="w-full bg-[#3B4F8C] text-white shadow-md py-2.5 rounded-[12px] font-bold hover:shadow-lg transition-all active:scale-[0.98] mt-auto">
                      {t("accept_job")}
                    </button>
                  ) : (
                    <Link href={`/jobs/${job.id}`} className="w-full bg-white border-2 border-[#3B4F8C] text-[#3B4F8C] flex items-center justify-center py-2.5 rounded-[12px] font-bold hover:bg-[#3B4F8C]/5 transition-all active:scale-[0.98] mt-auto">
                      {t("review_details")}
                    </Link>
                  )
                ) : (
                  <button disabled className="w-full bg-[#e8e8ea] text-[#454652] py-2.5 rounded-[8px] font-medium flex items-center justify-center gap-2 cursor-not-allowed mt-auto border border-[#d9dadc]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B6D24]" />
                    {t("accepted")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Government Schemes Section */}
        <section>
          <div className="flex justify-between items-end mb-5 px-1">
            <h3 className="text-lg font-black text-[#000666] font-lexend">{t("government_benefits")}</h3>
            <Link href="/schemes" className="text-xs font-black text-[#1B6D24] uppercase tracking-widest hover:underline">{t("view_all")}</Link>
          </div>
          
          <div className="space-y-4">
            {mockSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] flex items-center p-4">
                <div className="bg-[#ffdad6] p-3 rounded-full mr-4 shrink-0">
                  <FileCheck2 className="w-6 h-6 text-[#93000a]" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-bold text-[#1a1c1d] truncate">{scheme.title}</h4>
                  <p className="text-sm text-[#454652] font-medium mt-0.5 truncate">{scheme.benefit}</p>
                  {scheme.isEligible && (
                    <div className="inline-block mt-2 bg-[#f0f0f2] text-[#454652] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {t("eligible")}
                    </div>
                  )}
                </div>
                <Link href="/schemes" className="flex items-center gap-1 text-white font-bold bg-[#3B4F8C] px-4 py-2 rounded-xl active:scale-95 shadow-sm transition-transform shrink-0">
                  {t("apply")}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Quick Add Custom CSS for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
