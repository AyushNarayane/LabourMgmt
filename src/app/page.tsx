import React from "react";
import { Star, ShieldCheck, MapPin, IndianRupee, Briefcase, ChevronRight, FileCheck2, UserRound } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-20 font-sans">
      {/* Top Section / Header */}
      <div className="bg-[#1A237E] text-white pt-12 pb-24 px-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Shramik Setu</h1>
        <p className="text-[#bdc2ff] text-sm">Your Digital Civic Identity</p>
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
                  <h2 className="text-xl font-bold text-[#1A237E]">Raju Kumar</h2>
                  <p className="text-[#454652] font-medium text-sm flex items-center gap-1">
                    Mason <span className="text-[#c6c5d4]">•</span> Surat, GJ
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>4.8</span>
                    <span className="text-xs text-[#767683] font-normal ml-1">(24 Jobs)</span>
                  </div>
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="w-12 h-12 bg-white border border-[#c6c5d4] rounded shadow-sm p-1 flex flex-col justify-center items-center gap-0.5">
               <div className="flex gap-0.5"><div className="w-2 h-2 bg-black rounded-sm"/><div className="w-2 h-2 bg-black rounded-sm"/></div>
               <div className="flex gap-0.5"><div className="w-2 h-2 bg-black rounded-sm"/><div className="w-2 h-2 bg-black rounded-sm"/></div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#a0f399]/20 text-[#005312] p-3 rounded-xl border border-[#a0f399]">
              <div className="bg-[#1B6D24] rounded-full p-1 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold tracking-wider uppercase">Verified Identity</p>
                <p className="text-sm font-medium">Aadhaar Linked</p>
              </div>
            </div>
          </div>
        </section>

        {/* Matched Jobs Section */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-[#343d96]">Matched Jobs</h3>
            <span className="text-sm font-semibold text-[#1B6D24] cursor-pointer">View All</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x hide-scrollbar">
            {/* Job Card 1 */}
            <div className="min-w-[260px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 snap-start border border-[#eeeef0]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#1a1c1d]">Residential Mason</h4>
                <span className="bg-[#e0e0ff] text-[#000666] text-xs font-bold px-2 py-1 rounded-md">80% Match</span>
              </div>
              <p className="text-sm text-[#454652] mb-4">Shreeji Constructions</p>
              
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-[#454652]">
                  <MapPin className="w-4 h-4 text-[#767683]" />
                  <span>3.5 km away</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#454652]">
                  <Briefcase className="w-4 h-4 text-[#767683]" />
                  <span>5 Days req.</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#1B6D24]">
                  <IndianRupee className="w-4 h-4" />
                  <span>850 / day</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#000666] to-[#1A237E] text-white py-3 rounded-[8px] font-medium shadow-[0_4px_12px_rgba(26,35,126,0.2)] hover:shadow-lg transition-all active:scale-[0.98]">
                Accept Job
              </button>
            </div>

            {/* Job Card 2 */}
            <div className="min-w-[260px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 snap-start border border-[#eeeef0]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#1a1c1d]">Block Layer</h4>
                <span className="bg-[#f0f0f2] text-[#454652] text-xs font-bold px-2 py-1 rounded-md">65% Match</span>
              </div>
              <p className="text-sm text-[#454652] mb-4">Patel Farm Exp.</p>
              
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-[#454652]">
                  <MapPin className="w-4 h-4 text-[#767683]" />
                  <span>8.2 km away</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#454652]">
                  <Briefcase className="w-4 h-4 text-[#767683]" />
                  <span>2 Days req.</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#1B6D24]">
                  <IndianRupee className="w-4 h-4" />
                  <span>700 / day</span>
                </div>
              </div>
              
              <button className="w-full bg-white border-2 border-[#1A237E] text-[#1A237E] py-2.5 rounded-[8px] font-medium hover:bg-[#F3F3F5] transition-all active:scale-[0.98]">
                Review Details
              </button>
            </div>
          </div>
        </section>

        {/* Government Schemes Section */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-[#343d96]">Government Benefits</h3>
          </div>
          
          <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#eeeef0] flex items-center p-4">
            <div className="bg-[#ffdad6] p-3 rounded-full mr-4">
              <FileCheck2 className="w-6 h-6 text-[#93000a]" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#1a1c1d]">e-Shram Portal</h4>
              <p className="text-sm text-[#454652] font-medium mt-0.5">₹2 Lakh Insurance Cover</p>
              <div className="inline-block mt-2 bg-[#f0f0f2] text-[#454652] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Eligible
              </div>
            </div>
            <button className="flex items-center gap-1 text-[#1A237E] font-bold bg-[#e0e0ff] px-3 py-2 rounded-[8px] active:scale-95 transition-transform">
              Apply
              <ChevronRight className="w-4 h-4" />
            </button>
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
