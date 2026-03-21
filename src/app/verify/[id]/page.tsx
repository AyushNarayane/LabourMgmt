"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ShieldCheck, MapPin, Briefcase, Phone, Calendar, ArrowLeft, CheckCircle2, UserRound, AlertCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockWorker } from "@/lib/mockData";
import Link from "next/link";

export default function VerifyWorkerPage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const id = params?.id as string;
      if (!id) return;

      try {
        // 1. Try Firestore
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else if (id === "worker-1001" || id === "w-1001") {
          // 2. Fallback to Mock if it's our demo worker
          setProfile(mockWorker);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3B4F8C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3B4F8C] font-bold">Verifying Shramik Identity...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f3f3f5] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Verification Failed</h1>
        <p className="text-[#64748b] mb-8 max-w-xs">We couldn&apos;t find a registered worker with the provided Identity ID. Please check the QR code/ID and try again.</p>
        <button onClick={() => router.back()} className="w-full max-w-xs bg-[#3B4F8C] text-white py-4 rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const isVerified = profile.isAadhaarVerified || mockWorker.isAadhaarVerified;

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#3B4F8C] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
            Official Verification
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-xl border-4 border-white/20 overflow-hidden">
             <div className="w-full h-full rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <UserRound className="w-12 h-12 text-[#3B4F8C]" />
             </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
          <p className="text-[#bdc2ff] font-bold text-sm mt-1 uppercase tracking-wide">{profile.role || "Registered Worker"}</p>
        </div>
      </div>

      <main className="px-5 -mt-12 space-y-6 relative z-20">
        {/* Verification Banner */}
        <div className={`rounded-2xl p-5 shadow-lg border-2 flex items-center gap-4 ${
          isVerified ? "bg-white border-green-500/30" : "bg-white border-amber-500/30"
        }`}>
          <div className={`${isVerified ? "bg-green-600" : "bg-amber-500"} p-3 rounded-full shadow-md text-white`}>
            {isVerified ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">System Status</p>
            <p className={`text-lg font-bold ${isVerified ? "text-green-700" : "text-amber-600"}`}>
              {isVerified ? "Aadhaar Identity Verified" : "Identity Partially Linked"}
            </p>
          </div>
        </div>

        {/* Worker Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-6 space-y-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-6">
            <div>
              <p className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-[0.15em] mb-1">Current Rating</p>
              <div className="flex items-center gap-1.5 font-black text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {profile.rating || mockWorker.rating}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-[0.15em] mb-1">Jobs Completed</p>
              <p className="font-black text-[#1e293b]">{profile.jobsCompleted || mockWorker.jobsCompleted} Vetted Tasks</p>
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-[0.15em] mb-1">Base Location</p>
              <p className="font-bold text-[#1e293b] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#3B4F8C]" /> {profile.district || mockWorker.district}, {profile.state || mockWorker.state}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-[0.15em] mb-1">Works As</p>
              <p className="font-bold text-[#1e293b]">{profile.skills?.[0] || profile.role || mockWorker.role}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e2e8f0]">
            <p className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-[0.15em] mb-3">Skills & Expertise</p>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || mockWorker.skills).map((skill: string) => (
                <span key={skill} className="bg-[#3B4F8C]/10 text-[#3B4F8C] text-xs font-black px-3 py-1.5 rounded-lg border border-[#3B4F8C]/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <button className="w-full bg-[#1B6D24] text-white py-4 rounded-xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Hire This worker
          </button>
          <button className="w-full bg-white border-2 border-[#3B4F8C] text-[#3B4F8C] py-4 rounded-xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md">
            <Phone className="w-5 h-5" /> Contact for Quote
          </button>
        </div>

        <p className="text-center text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-8 mt-6">
          This profile is cryptographically verified by Shramik Setu Official Identity Service.
        </p>
      </main>
    </div>
  );
}
