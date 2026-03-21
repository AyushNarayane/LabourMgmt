"use client";

import React from "react";
import { ArrowLeft, FileCheck2, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { mockSchemes } from "@/lib/mockData";
import Link from "next/link";

export default function SchemesPage() {
  const eligible = mockSchemes.filter(s => s.isEligible);
  const notEligible = mockSchemes.filter(s => !s.isEligible);

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1A237E] text-white pt-12 pb-8 px-6 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Government Schemes</h1>
        </div>
        <p className="text-[#bdc2ff] text-sm">You are eligible for {eligible.length} schemes based on your profile.</p>
      </div>

      <main className="px-5 mt-6 space-y-6">
        {/* Eligible Schemes */}
        <div>
          <h3 className="text-lg font-bold text-[#343d96] mb-4 px-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1B6D24]" /> Eligible Schemes
          </h3>
          <div className="space-y-4">
            {eligible.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-5">
                <div className="flex items-start mb-4">
                  <div className="bg-[#a0f399]/30 p-3 rounded-full mr-4 shrink-0">
                    <FileCheck2 className="w-7 h-7 text-[#1B6D24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1a1c1d] text-lg mb-1">{scheme.title}</h4>
                    <div className="inline-block bg-[#a0f399]/30 text-[#005312] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-2">
                      ✓ You Are Eligible
                    </div>
                    <p className="text-[#1B6D24] font-bold text-sm">{scheme.benefit}</p>
                    <p className="text-sm text-[#767683] mt-2 leading-relaxed">{scheme.description}</p>
                  </div>
                </div>
                
                <div className="border-t border-[#eeeef0] pt-4 mt-2 flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#454652]">Requires Aadhaar</span>
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#000666] to-[#1A237E] text-white font-bold px-6 py-2.5 rounded-[8px] active:scale-95 transition-transform"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Eligible Schemes */}
        {notEligible.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-[#767683] mb-4 px-1 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Not Eligible
            </h3>
            <div className="space-y-4">
              {notEligible.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] p-5 opacity-60">
                  <div className="flex items-start">
                    <div className="bg-[#f0f0f2] p-3 rounded-full mr-4 shrink-0">
                      <FileCheck2 className="w-7 h-7 text-[#767683]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1a1c1d] text-lg mb-1">{scheme.title}</h4>
                      <p className="text-[#454652] font-medium text-sm">{scheme.benefit}</p>
                      <p className="text-sm text-[#767683] mt-2">{scheme.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
