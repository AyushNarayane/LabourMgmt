"use client";

import React, { useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, IndianRupee, ShieldCheck } from "lucide-react";
import { SKILL_OPTIONS, STATE_OPTIONS, checkWageFairness } from "@/lib/mockData";
import Link from "next/link";

export default function PostJobPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skill: "",
    state: "",
    location: "",
    durationDays: "",
    wagePerDay: "",
  });

  const [wageFeedback, setWageFeedback] = useState<{
    isFair: boolean;
    minimumWage: number | null;
    message: string;
  } | null>(null);

  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWageBlur = () => {
    if (form.state && form.skill && form.wagePerDay) {
      const result = checkWageFairness(form.state, form.skill, Number(form.wagePerDay));
      setWageFeedback(result);
      setAcknowledged(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wageFeedback && !wageFeedback.isFair && !acknowledged) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] font-sans flex flex-col items-center justify-center px-8">
        <div className="bg-[#a0f399]/30 p-6 rounded-full mb-6">
          <CheckCircle2 className="w-16 h-16 text-[#1B6D24]" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Job Posted Successfully!</h1>
        <p className="text-[#767683] text-center mb-2 max-w-sm">
          Your job &quot;{form.title}&quot; has been posted. Matched workers nearby will be notified via app and SMS.
        </p>
        {wageFeedback && (
          <div className={`flex items-center gap-2 text-sm font-semibold mt-2 mb-6 ${wageFeedback.isFair ? "text-[#005312]" : "text-[#93000a]"}`}>
            {wageFeedback.isFair ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {wageFeedback.isFair ? "Wage verified ✓" : "Wage flagged — below minimum"}
          </div>
        )}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Link href="/employer" className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-center text-lg active:scale-95 transition-transform">
            Back to Dashboard
          </Link>
          <button
            onClick={() => { setSubmitted(false); setForm({ title: "", description: "", skill: "", state: "", location: "", durationDays: "", wagePerDay: "" }); setWageFeedback(null); }}
            className="w-full bg-white border-2 border-[#1A237E] text-[#1A237E] py-3 rounded-xl font-bold text-center active:scale-95 transition-transform"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white pt-12 pb-8 px-6 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/employer" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Post a New Job</h1>
        </div>
        <p className="text-[#bdc2ff] text-sm">Fill in the details below. Wage Fairness Check runs automatically.</p>
      </div>

      <main className="px-5 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
            <h3 className="font-bold text-lg text-[#343d96]">Job Details</h3>

            <div>
              <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Job Title*</label>
              <input
                type="text" required
                placeholder="e.g. Residential Mason"
                value={form.title}
                onChange={(e) => setForm(p => ({...p, title: e.target.value}))}
                className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Skill Required*</label>
              <select
                required
                value={form.skill}
                onChange={(e) => { setForm(p => ({...p, skill: e.target.value})); setWageFeedback(null); }}
                className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all appearance-none"
              >
                <option value="">Select skill</option>
                {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the work, requirements, safety gear needed..."
                value={form.description}
                onChange={(e) => setForm(p => ({...p, description: e.target.value}))}
                className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all resize-none"
              />
            </div>
          </div>

          {/* Location & Duration */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
            <h3 className="font-bold text-lg text-[#343d96]">Location & Duration</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">State*</label>
                <select
                  required
                  value={form.state}
                  onChange={(e) => { setForm(p => ({...p, state: e.target.value})); setWageFeedback(null); }}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all appearance-none"
                >
                  <option value="">Select</option>
                  {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Area / Village</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm(p => ({...p, location: e.target.value}))}
                  className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Duration (days)*</label>
              <input
                type="number" min="1" required
                placeholder="Number of days"
                value={form.durationDays}
                onChange={(e) => setForm(p => ({...p, durationDays: e.target.value}))}
                className="w-full bg-[#e8e8ea] rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
              />
            </div>
          </div>

          {/* Wage Section — THE CORE FEATURE */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
            <h3 className="font-bold text-lg text-[#343d96]">Wage & Fairness Check</h3>

            <div>
              <label className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-1.5 block">Daily Wage (₹)*</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#767683]" />
                <input
                  type="number" min="1" required
                  placeholder="Enter daily wage"
                  value={form.wagePerDay}
                  onChange={(e) => { setForm(p => ({...p, wagePerDay: e.target.value})); setWageFeedback(null); }}
                  onBlur={handleWageBlur}
                  className="w-full bg-[#e8e8ea] rounded-xl pl-12 pr-4 py-3.5 text-lg font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
                />
              </div>
            </div>

            {/* Wage Fairness Feedback */}
            {wageFeedback && (
              <div className={`p-4 rounded-xl border-2 ${
                wageFeedback.isFair
                  ? "bg-[#a0f399]/15 border-[#a0f399] text-[#005312]"
                  : "bg-[#ffdad6]/30 border-[#ffdad6] text-[#93000a]"
              }`}>
                <div className="flex items-start gap-3">
                  {wageFeedback.isFair
                    ? <CheckCircle2 className="w-5 h-5 text-[#1B6D24] mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-[#ba1a1a] mt-0.5 shrink-0" />}
                  <div>
                    <p className="font-bold text-sm">{wageFeedback.message}</p>
                    {!wageFeedback.isFair && (
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acknowledged}
                          onChange={(e) => setAcknowledged(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#ba1a1a]"
                        />
                        <span className="text-xs font-medium">I acknowledge this offer is below the state minimum wage</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title || !form.skill || !form.state || !form.wagePerDay || !form.durationDays || (wageFeedback !== null && !wageFeedback.isFair && !acknowledged)}
            className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
          >
            Post Job
          </button>
        </form>
      </main>
    </div>
  );
}
