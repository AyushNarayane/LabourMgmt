"use client";

import React from "react";
import { ArrowLeft, MapPin, IndianRupee, Briefcase, CalendarClock, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { mockJobs, Job } from "@/lib/mockData";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function AllJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/register?role=worker");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    async function fetchJobs() {
      try {
        const jobsRef = collection(db, "jobs");
        const snapshot = await getDocs(jobsRef);
        const fbJobs: Job[] = [];
        snapshot.forEach((doc) => fbJobs.push({ id: doc.id, ...doc.data() } as Job));
        setJobs(fbJobs.length > 0 ? fbJobs : mockJobs);
      } catch (err) {
        console.error(err);
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      <div className="bg-[#1A237E] text-white pt-12 pb-8 px-6 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Available Jobs</h1>
        </div>
        <p className="text-[#bdc2ff] text-sm">{loading ? 'Loading jobs...' : `${jobs.length} jobs matched to your skills`}</p>
      </div>

      <main className="px-5 mt-6 space-y-4">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="block">
            <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-5 active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-[#1a1c1d] text-lg">{job.title}</h4>
                  <p className="text-sm text-[#454652] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${job.matchScore >= 80 ? 'bg-[#e0e0ff] text-[#000666]' : 'bg-[#f0f0f2] text-[#454652]'}`}>
                  {job.matchScore}% Match
                </span>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
                <div className="flex items-center gap-1.5 text-sm text-[#454652]">
                  <MapPin className="w-4 h-4 text-[#767683]" /> {job.distanceKm} km
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#454652]">
                  <Briefcase className="w-4 h-4 text-[#767683]" /> {job.durationDays} days
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#454652]">
                  <CalendarClock className="w-4 h-4 text-[#767683]" /> {job.startDate}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#f0f0f2]">
                <div className="flex items-center gap-1.5 text-lg font-bold text-[#1B6D24]">
                  <IndianRupee className="w-5 h-5" /> {job.wagePerDay}/day
                </div>
                {job.wageFairnessStatus === "verified" && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#005312] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Wage Verified
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
