"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, MapPin, IndianRupee, Briefcase, ChevronRight, FileCheck2, UserRound, CheckCircle2, LogOut, LogIn } from "lucide-react";
import { mockWorker, mockJobs, mockSchemes, Job } from "@/lib/mockData";
import Link from "next/link";
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
      <div className="bg-[#1A237E] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{t("app_name")}</h1>
            <p className="text-[#bdc2ff] text-sm">{t("app_tagline")}</p>
          </div>
          {isLoggedIn ? (
            <button onClick={() => signOut()} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-medium transition-all">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          ) : (
            <Link href="/register" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-5 -mt-16 space-y-8">
        
        {/* Digital Labour Card */}
        <section>
          <div className="bg-white rounded-2xl shadow-[0_12px_32px_rgba(26,35,126,0.08)] p-6 relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-[#f3f3f5] flex items-center justify-center overflow-hidden border-2 border-[#1A237E]/20">
                  <UserRound className="w-8 h-8 text-[#1A237E]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1A237E]">{displayName}</h2>
                  <p className="text-[#454652] font-medium text-sm flex items-center gap-1">
                    {displayRole} <span className="text-[#c6c5d4]">•</span> {displayLocation}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{worker.rating}</span>
                    <span className="text-xs text-[#767683] font-normal ml-1">({worker.jobsCompleted} Jobs)</span>
                  </div>
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="w-12 h-12 bg-white border border-[#c6c5d4] rounded shadow-sm p-1 flex flex-col justify-center items-center gap-0.5">
               <div className="flex gap-0.5"><div className="w-2 h-2 bg-black rounded-sm"/><div className="w-2 h-2 bg-black rounded-sm"/></div>
               <div className="flex gap-0.5"><div className="w-2 h-2 bg-black rounded-sm"/><div className="w-2 h-2 bg-black rounded-sm"/></div>
              </div>
            </div>

            {isAadhaarVerified && (
              <div className="flex items-center gap-3 bg-[#a0f399]/20 text-[#005312] p-3 rounded-xl border border-[#a0f399]">
                <div className="bg-[#1B6D24] rounded-full p-1 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-wider uppercase">{t("verified_identity")}</p>
                  <p className="text-sm font-medium">{t("aadhaar_linked")}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Matched Jobs Section */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-[#343d96]">{t("matched_jobs")}</h3>
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
                      className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white shadow-[0_4px_12px_rgba(26,35,126,0.2)] py-2.5 rounded-[8px] font-medium hover:shadow-lg transition-all active:scale-[0.98] mt-auto">
                      {t("accept_job")}
                    </button>
                  ) : (
                    <Link href={`/jobs/${job.id}`} className="w-full bg-white border-2 border-[#1A237E] text-[#1A237E] flex items-center justify-center py-2.5 rounded-[8px] font-medium hover:shadow-sm transition-all active:scale-[0.98] mt-auto">
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
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-[#343d96]">{t("government_benefits")}</h3>
            <Link href="/schemes" className="text-sm font-semibold text-[#1B6D24] cursor-pointer hover:underline">{t("view_all")}</Link>
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
                <Link href="/schemes" className="flex items-center gap-1 text-[#1A237E] font-bold bg-[#e0e0ff] px-3 py-2 rounded-[8px] active:scale-95 transition-transform shrink-0">
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
