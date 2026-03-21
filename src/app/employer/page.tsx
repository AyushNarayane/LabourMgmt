"use client";

import React from "react";
import { Briefcase, Users, AlertTriangle, TrendingUp, Plus, Star, MapPin, UserRound, Trash2, FileCheck2, ChevronRight } from "lucide-react";
import { mockEmployer, Job } from "@/lib/mockData";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [postedJobs, setPostedJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/register?role=employer");
    }
  }, [user, userProfile, authLoading, router]);

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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/employer/post-job" className="block">
            <div className="bg-[#3B4F8C] rounded-2xl p-5 flex flex-col items-center gap-3 shadow-lg active:scale-[0.98] transition-all text-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg font-lexend">Post a Job</p>
                <p className="text-[#bdc2ff] text-[10px] uppercase font-black tracking-widest">Find Recruits</p>
              </div>
            </div>
          </Link>

          <Link href="/employer/issue-certificate" className="block">
            <div className="bg-white border-2 border-[#3B4F8C] rounded-2xl p-5 flex flex-col items-center gap-3 shadow-md active:scale-[0.98] transition-colors text-center group hover:bg-[#3B4F8C]/5">
              <div className="bg-[#3B4F8C]/10 p-3 rounded-full group-hover:bg-[#3B4F8C]/20 transition-colors">
                <FileCheck2 className="w-6 h-6 text-[#3B4F8C]" />
              </div>
              <div>
                <p className="text-[#3B4F8C] font-black text-lg font-lexend">Issue Log</p>
                <p className="text-[#94a3b8] text-[10px] uppercase font-black tracking-widest">Certify Work</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Jobs */}
        <div>
          <h3 className="text-lg font-bold text-[#343d96] mb-4 px-1">Your Recent Postings</h3>
          <div className="space-y-3">
            {postedJobs.length > 0 ? postedJobs.map(job => (
              <Link key={job.id} href={`/employer/job/${job.id}`} className="block bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-5 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-1/2 -mt-3 right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <ChevronRight className="w-6 h-6 text-[#3B4F8C]" />
                </div>
                <div className="flex justify-between items-start mb-2 pr-6">
                  <h4 className="font-bold text-[#1a1c1d]">{job.title}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    job.status === 'open' ? 'bg-[#a0f399]/30 text-[#005312]' : 'bg-[#f0f0f2] text-[#454652]'
                  }`}>{job.status}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#454652] mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span>₹{job.wagePerDay}/day · {job.durationDays} days</span>
                </div>
                
                {/* Applicants Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1.5 rounded-md">
                   <Users className="w-3.5 h-3.5 text-[#3B4F8C]" />
                   <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider">
                     {((job as any).acceptedWorkers?.length || 0)} Workers Joined
                   </span>
                </div>
              </Link>
            )) : (
              <p className="text-sm text-[#767683] text-center py-8">No jobs posted yet. Post your first job above!</p>
            )}
          </div>
        </div>

        {/* Restore Switch View Link for easier testing */}
        <Link href="/" className="block text-center text-sm font-semibold text-[#3B4F8C] hover:underline mt-8">
          ← Switch to Worker View
        </Link>
      </main>
    </div>
  );
}
