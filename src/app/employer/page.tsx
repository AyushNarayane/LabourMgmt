"use client";

import React from "react";
import { Briefcase, Users, AlertTriangle, TrendingUp, Plus, Star, MapPin } from "lucide-react";
import { mockEmployer, Job } from "@/lib/mockData";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [postedJobs, setPostedJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/register?role=employer");
    }
  }, [user, authLoading, router]);

  // Fallback if not logged in
  const employer = {
    ...mockEmployer,
    businessName: userProfile?.businessName || userProfile?.name || mockEmployer.businessName,
    location: userProfile?.district && userProfile?.state 
      ? `${userProfile.district}, ${userProfile.state.substring(0,2).toUpperCase()}` 
      : mockEmployer.location,
    contactPerson: userProfile?.name || mockEmployer.contactPerson,
  };

  React.useEffect(() => {
    async function fetchEmployerJobs() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const jobsRef = collection(db, "jobs");
        const q = query(
          jobsRef, 
          where("employerId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fbJobs: Job[] = [];
        snapshot.forEach((doc) => fbJobs.push({ id: doc.id, ...doc.data() } as Job));
        setPostedJobs(fbJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployerJobs();
  }, [user]);

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#3B4F8C] text-white pt-12 pb-10 px-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10">
          <p className="text-[#bdc2ff] text-xs font-bold uppercase tracking-[0.2em]">Official Employer Portal</p>
          <h1 className="text-2xl font-bold tracking-tight mt-1">{employer.businessName}</h1>
          <p className="text-[#bdc2ff] text-sm mt-1">{employer.contactPerson} · {employer.location}</p>
        </div>
      </div>

      <main className="px-5 -mt-4 space-y-6">
        {/* Verification / Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e2e8f0] p-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-[#3B4F8C] rounded-full p-2">
                <Users className="w-5 h-5 text-white" />
             </div>
             <h2 className="text-lg font-bold text-[#1e293b]">Verify a Worker</h2>
          </div>
          <p className="text-sm text-[#64748b] mb-5">Scan the worker&apos;s digital card QR code or enter their ID below to verify identity and skills.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Worker ID (e.g. w-1001)"
              className="flex-1 bg-[#f1f5f9] rounded-xl px-4 py-3 text-sm font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3B4F8C] transition-all"
              id="workerIdSearch"
            />
            <button 
              onClick={() => {
                const id = (document.getElementById('workerIdSearch') as HTMLInputElement).value;
                if (id) router.push(`/verify/${id}`);
              }}
              className="bg-[#3B4F8C] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <Briefcase className="w-6 h-6 text-[#3B4F8C] mb-3" />
            <p className="text-3xl font-bold text-[#1e293b]">{loading ? "-" : postedJobs.length}</p>
            <p className="text-[10px] font-extrabold text-[#94a3b8] uppercase tracking-wider mt-1">Jobs Posted</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <Users className="w-6 h-6 text-green-600 mb-3" />
            <p className="text-3xl font-bold text-[#1e293b]">38</p>
            <p className="text-[10px] font-extrabold text-[#94a3b8] uppercase tracking-wider mt-1">Workers Hired</p>
          </div>
        </div>

        {/* Post New Job CTA */}
        <Link href="/employer/post-job" className="block">
          <div className="bg-[#3B4F8C] rounded-2xl p-5 flex items-center gap-4 shadow-lg active:scale-[0.98] transition-all">
            <div className="bg-white/20 p-3 rounded-full">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg">Post a New Job</p>
              <p className="text-[#bdc2ff] text-sm">Find verified workers nearby</p>
            </div>
          </div>
        </Link>

        {/* Recent Jobs */}
        <div>
          <h3 className="text-lg font-bold text-[#343d96] mb-4 px-1">Your Recent Postings</h3>
          <div className="space-y-3">
            {postedJobs.length > 0 ? postedJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#1a1c1d]">{job.title}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    job.status === 'open' ? 'bg-[#a0f399]/30 text-[#005312]' : 'bg-[#f0f0f2] text-[#454652]'
                  }`}>{job.status}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#454652]">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span>₹{job.wagePerDay}/day · {job.durationDays} days</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#767683] text-center py-8">No jobs posted yet. Post your first job above!</p>
            )}
          </div>
        </div>

        {/* Switch to Worker View */}
        <Link href="/" className="block text-center text-sm font-semibold text-[#1A237E] hover:underline mt-4">
          ← Switch to Worker View
        </Link>
      </main>
    </div>
  );
}
