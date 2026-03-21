"use client";

import React, { useState, use } from "react";
import { ArrowLeft, MapPin, IndianRupee, Briefcase, CalendarClock, Building2, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { mockJobs } from "@/lib/mockData";
import Link from "next/link";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const job = mockJobs.find(j => j.id === resolvedParams.id);
  const [accepted, setAccepted] = useState(false);

  if (!job) {
    return (
      <div className="bg-[#f3f3f5] min-h-screen flex flex-col items-center justify-center text-center px-8 font-sans">
        <h1 className="text-2xl font-bold text-[#1a1c1d] mb-2">Job Not Found</h1>
        <p className="text-[#767683] mb-6">This job may have been filled or removed.</p>
        <Link href="/jobs" className="bg-gradient-to-r from-[#000666] to-[#1A237E] text-white font-bold px-8 py-3 rounded-xl">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-32 font-sans relative">
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-md">
        <Link href="/jobs" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition mb-4 inline-block">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold tracking-tight pr-4">{job.title}</h1>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-lg shrink-0 ${job.matchScore >= 80 ? 'bg-[#e0e0ff] text-[#000666]' : 'bg-white/20 text-white'}`}>
            {job.matchScore}% Match
          </span>
        </div>
      </div>

      <main className="px-5 -mt-16 space-y-6">
        <div className="bg-white rounded-2xl shadow-[0_12px_32px_rgba(26,35,126,0.08)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#f0f0f2] p-3 rounded-full">
              <Building2 className="w-6 h-6 text-[#1A237E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#767683] uppercase tracking-wider mb-0.5">Employer</p>
              <h3 className="text-lg font-bold text-[#1a1c1d]">{job.company}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-2">
            <div>
              <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1">Location</p>
              <div className="flex items-center gap-2 font-medium text-[#454652]">
                <MapPin className="w-4 h-4 text-[#1A237E]" />
                {job.location} ({job.distanceKm} km)
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1">Duration</p>
              <div className="flex items-center gap-2 font-medium text-[#454652]">
                <Briefcase className="w-4 h-4 text-[#1A237E]" />
                {job.durationDays} Days
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1">Payment</p>
              <div className="flex items-center gap-2 font-bold text-[#1B6D24] text-lg">
                <IndianRupee className="w-5 h-5" />
                {job.wagePerDay}/day
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1">Start Date</p>
              <div className="flex items-center gap-2 font-medium text-[#454652]">
                <CalendarClock className="w-4 h-4 text-[#1A237E]" />
                {job.startDate}
              </div>
            </div>
          </div>
        </div>

        {/* Wage fairness indicator */}
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          job.wageFairnessStatus === 'verified'
            ? 'bg-[#a0f399]/15 border border-[#a0f399]'
            : 'bg-[#ffdad6]/30 border border-[#ffdad6]'
        }`}>
          {job.wageFairnessStatus === 'verified'
            ? <ShieldCheck className="w-5 h-5 text-[#1B6D24]" />
            : <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
          }
          <p className={`text-sm font-bold ${job.wageFairnessStatus === 'verified' ? 'text-[#005312]' : 'text-[#93000a]'}`}>
            {job.wageFairnessStatus === 'verified'
              ? 'Wage verified — meets state minimum wage'
              : 'Warning: Below legal minimum wage'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-6">
          <h3 className="text-lg font-bold text-[#1a1c1d] mb-3">Job Description</h3>
          <p className="text-[#454652] leading-relaxed">{job.description}</p>
          
          <div className="mt-5">
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2">Skills Required</p>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map(s => (
                <span key={s} className="bg-[#e0e0ff] text-[#000666] text-xs font-bold px-3 py-1.5 rounded-lg">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-xl border-t border-[#eeeef0]">
        {!accepted ? (
          <button
            onClick={() => setAccepted(true)}
            className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold shadow-[0_4px_12px_rgba(26,35,126,0.2)] text-lg hover:shadow-lg transition-transform active:scale-95"
          >
            Accept Job Offer
          </button>
        ) : (
          <button disabled className="w-full bg-[#a0f399]/30 text-[#005312] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 border border-[#a0f399]">
            <CheckCircle2 className="w-5 h-5" />
            Job Accepted — You will be notified
          </button>
        )}
      </div>
    </div>
  );
}
