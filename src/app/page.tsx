"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, UserRound, ShieldCheck, Activity } from "lucide-react";
import { useLang } from "@/components/LangProvider";
import { useUser } from "@/components/UserProvider";

export default function Home() {
  const { t } = useLang();
  const { user, userProfile } = useAuth();

  return (
    <div className="bg-[#f9f9fb] min-h-screen text-[#1a1c1d] font-sans flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1e293b] to-[#3B4F8C]"></div>
        {/* Subtle decorative mesh/dots could go here */}
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-8 backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-4 h-4" />
            Empowering the Unorganized Workforce
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Dignity in Work,<br /> Security in Life
          </h1>

          <p className="text-lg md:text-xl text-[#bdc2ff] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Shramik Setu bridges the gap between verified workers, reliable employers, and essential government welfare. A civic platform built on trust.
          </p>
        </div>
      </section>

      {/* Action Cards (Pulled up to overlap hero) */}
      <section className="px-5 -mt-16 sm:-mt-24 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          
          {/* Worker Card */}
          <Link
            href={user ? "/worker" : "/register?role=worker"}
            className="group block bg-white rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(26,35,126,0.08)] border border-[#eeeef0] transition-all hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(26,35,126,0.12)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#e0e0ff] flex items-center justify-center mb-6">
              <UserRound className="w-8 h-8 text-[#1A237E]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A237E] mb-3 group-hover:text-[#000666] transition-colors">
              I am a Job Seeker
            </h2>
            <p className="text-[#454652] mb-8 leading-relaxed">
              Find fair-wage jobs near you, access government benefits, and build your digital, verified labor identity.
            </p>
            <div className="flex items-center gap-2 text-[#1A237E] font-bold">
              <span>{user ? "Enter Worker Portal" : "Join as a Worker"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            href={user ? "/employer" : "/register?role=employer"}
            className="group block bg-white rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(26,35,126,0.08)] border border-[#eeeef0] transition-all hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(26,35,126,0.12)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#a0f399]/30 flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-[#1B6D24]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B6D24] mb-3 group-hover:text-[#005312] transition-colors">
              I am an Employer
            </h2>
            <p className="text-[#454652] mb-8 leading-relaxed">
              Post jobs, find skilled and verified local labor instantly, and manage your workforce with full compliance.
            </p>
            <div className="flex items-center gap-2 text-[#1B6D24] font-bold">
              <span>{user ? "Enter Employer Portal" : "Join as an Employer"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Feature Highlighting / Trust markers */}
      <section className="py-16 bg-white border-t border-[#eeeef0] mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#e8e8ea]">
            <div className="py-4 md:py-0 px-4">
              <div className="mx-auto w-12 h-12 bg-[#3B4F8C]/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#3B4F8C]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Identity</h3>
              <p className="text-sm text-[#767683]">Aadhaar-linked profiles for complete trust and transparency.</p>
            </div>
            <div className="py-4 md:py-0 px-4">
              <div className="mx-auto w-12 h-12 bg-[#a0f399]/30 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-[#1B6D24]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Wage Fairness</h3>
              <p className="text-sm text-[#767683]">Real-time checks against state minimum wage laws.</p>
            </div>
            <div className="py-4 md:py-0 px-4">
              <div className="mx-auto w-12 h-12 bg-[#ffdad6]/50 rounded-full flex items-center justify-center mb-4">
                <UserRound className="w-6 h-6 text-[#93000a]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Civic Dignity</h3>
              <p className="text-sm text-[#767683]">Direct access to targeted government welfare schemes.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
