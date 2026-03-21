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
    if (authLoading) return;
    if (!user) {
      router.push("/register?role=employer");
    } else if (userProfile && userProfile.role === "worker") {
      router.push("/worker");
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
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-12 pb-10 px-6 rounded-b-3xl shadow-md">
        <p className="text-[#bdc2ff] text-xs font-bold uppercase tracking-wider">Employer Dashboard</p>
        <h1 className="text-2xl font-bold tracking-tight mt-1">{employer.businessName}</h1>
        <p className="text-[#bdc2ff] text-sm mt-1">{employer.contactPerson} · {employer.location}</p>
      </div>

      <main className="px-5 -mt-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <Briefcase className="w-6 h-6 text-[#1A237E] mb-3" />
            <p className="text-3xl font-bold text-[#1a1c1d]">{loading ? "-" : postedJobs.length}</p>
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mt-1">Jobs Posted</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <Users className="w-6 h-6 text-[#1B6D24] mb-3" />
            <p className="text-3xl font-bold text-[#1a1c1d]">38</p>
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mt-1">Workers Hired</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <Star className="w-6 h-6 text-amber-500 mb-3" />
            <p className="text-3xl font-bold text-[#1a1c1d]">{employer.trustScore}</p>
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mt-1">Trust Score</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 border border-[#eeeef0]">
            <AlertTriangle className={`w-6 h-6 mb-3 ${employer.wageViolations > 0 ? "text-[#ba1a1a]" : "text-[#1B6D24]"}`} />
            <p className="text-3xl font-bold text-[#1a1c1d]">{employer.wageViolations}</p>
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mt-1">Wage Flags</p>
          </div>
        </div>

        {/* Post New Job CTA */}
        <Link href="/employer/post-job" className="block">
          <div className="bg-gradient-to-r from-[#000666] to-[#1A237E] rounded-2xl p-5 flex items-center gap-4 shadow-lg active:scale-[0.98] transition-transform">
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

      </main>
    </div>
  );
}
