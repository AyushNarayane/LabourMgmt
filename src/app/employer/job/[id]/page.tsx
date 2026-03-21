"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, MapPin, Users, UserRound, Star, Trash2, Edit3, CircleDashed, Award, FileCheck2, UserCheck, Clock, Camera, X, ScanLine, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import jsQR from "jsqr";

export default function JobDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [addWorkerId, setAddWorkerId] = useState("");
  const [addingWorker, setAddingWorker] = useState(false);
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isScanningRef = React.useRef(false);

  const startScanner = async () => {
    setIsScanning(true);
    isScanningRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error(err);
      alert("Camera access denied or unavailable.");
      setIsScanning(false);
      isScanningRef.current = false;
    }
  };

  const stopScanner = () => {
    setIsScanning(false);
    isScanningRef.current = false;
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const tick = () => {
    if (!isScanningRef.current) return;
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code && code.data) {
          setAddWorkerId(code.data);
          stopScanner();
          // Small delay before clicking
          setTimeout(() => {
            document.getElementById('verify-submit-btn')?.click();
          }, 300);
          return;
        }
      }
    }
    requestAnimationFrame(tick);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    async function fetchJob() {
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleRemoveWorker = async (workerObj: any) => {
    if (!confirm(`Are you sure you want to remove ${workerObj.name}?`)) return;
    try {
      const jobRef = doc(db, "jobs", id);
      await updateDoc(jobRef, {
        acceptedWorkers: arrayRemove(workerObj)
      });
      setJob((prev: any) => ({
        ...prev,
        acceptedWorkers: prev.acceptedWorkers.filter((w: any) => w.workerId !== workerObj.workerId)
      }));
    } catch(err) {
      console.error(err);
      alert("Failed to remove worker.");
    }
  };

  const handleMarkPresent = async (workerObj: any) => {
    try {
      const jobRef = doc(db, "jobs", id);
      const newWorkerObj = { ...workerObj, status: "present", verifiedAt: new Date().toISOString() };
      
      await updateDoc(jobRef, {
        acceptedWorkers: arrayRemove(workerObj)
      });
      await updateDoc(jobRef, {
        acceptedWorkers: arrayUnion(newWorkerObj)
      });
      
      setJob((prev: any) => ({
        ...prev,
        acceptedWorkers: [
          ...(prev.acceptedWorkers.filter((w: any) => w.workerId !== workerObj.workerId)),
          newWorkerObj
        ]
      }));
    } catch(err) {
      console.error(err);
      alert("Failed to mark worker as present.");
    }
  };

  const handleManualAddWorker = async () => {
    if (!addWorkerId.trim()) return;
    setAddingWorker(true);
    try {
      const targetWorkerId = addWorkerId.trim();
      
      // Check if worker applied tentatively
      const existingWorker = job.acceptedWorkers?.find((w: any) => w.workerId === targetWorkerId);
      
      let newWorkerObj;
      const jobRef = doc(db, "jobs", id);

      if (existingWorker) {
        newWorkerObj = { ...existingWorker, status: "present", verifiedAt: new Date().toISOString() };
        await updateDoc(jobRef, { acceptedWorkers: arrayRemove(existingWorker) });
        await updateDoc(jobRef, { acceptedWorkers: arrayUnion(newWorkerObj) });
      } else {
        const userRef = doc(db, "users", targetWorkerId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          newWorkerObj = {
            workerId: targetWorkerId,
            name: userData.name || "Verified Worker",
            role: userData.role === "worker" ? "Shramik" : "Contractor Worker",
            phone: userData.phone || "Verified Offline",
            experience: userData.skills?.join(", ") || "Verified Skills",
            rating: userData.rating || 4.5,
            acceptedAt: new Date().toISOString(),
            status: "present",
            verifiedAt: new Date().toISOString()
          };
        } else {
          newWorkerObj = {
            workerId: targetWorkerId,
            name: "Verified Offline Shramik", 
            role: "General Helper",
            phone: "Verified Offline",
            experience: "Offline verified",
            rating: 4.8,
            acceptedAt: new Date().toISOString(),
            status: "present",
            verifiedAt: new Date().toISOString()
          };
        }
        await updateDoc(jobRef, { acceptedWorkers: arrayUnion(newWorkerObj) });
      }
      
      setJob((prev: any) => ({
        ...prev,
        acceptedWorkers: [
          ...(prev.acceptedWorkers?.filter((w: any) => w.workerId !== targetWorkerId) || []), 
          newWorkerObj
        ]
      }));
      setAddWorkerId("");
    } catch(err) {
      console.error(err);
      alert("Failed to verify & add worker.");
    } finally {
      setAddingWorker(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job posting? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      router.push("/employer");
    } catch (error) {
      console.error(error);
      alert("Failed to delete job.");
    }
  };

  if (loading) return <div className="bg-[#f3f3f5] min-h-screen flex items-center justify-center"><CircleDashed className="w-8 h-8 text-[#000666] animate-spin" /></div>;

  if (!job) return (
      <div className="bg-[#f3f3f5] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-[#000666]">Job Not Found</h2>
        <p className="text-[#64748b] mb-6">This job posting might have been deleted or doesn&apos;t exist.</p>
        <Link href="/employer" className="bg-[#000666] text-white px-6 py-3 rounded-lg font-bold shadow-md">Go Back</Link>
      </div>
  );

  const searchFilterStr = addWorkerId.trim().toLowerCase();
  
  const tentativeWorkers = job.acceptedWorkers?.filter((w: any) => {
    if (w.status === 'present') return false;
    if (!searchFilterStr) return true;
    return w.name?.toLowerCase().includes(searchFilterStr) || w.workerId?.toLowerCase().includes(searchFilterStr);
  }) || [];
  
  const presentWorkers = job.acceptedWorkers?.filter((w: any) => {
    if (w.status !== 'present') return false;
    if (!searchFilterStr) return true;
    return w.name?.toLowerCase().includes(searchFilterStr) || w.workerId?.toLowerCase().includes(searchFilterStr);
  }) || [];

  return (
    <div className="bg-[#f3f3f5] min-h-screen text-[#1a1c1d] pb-24 font-sans antialiased">
      <div className="bg-[#3B4F8C] text-white pt-12 pb-24 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10">
          <Link href="/employer" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </Link>
          <div className="flex justify-between items-start gap-4">
             <div>
               <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-md border border-white/20 mb-3 text-[10px] font-black uppercase tracking-widest ${job.status === "open" ? "text-[#a0f399]" : "text-amber-300"}`}>
                 {job.status === "open" ? "ACTIVE POSTING" : "CLOSED"}
               </div>
               <h1 className="text-3xl font-black font-lexend leading-tight pr-4">{job.title}</h1>
               <p className="text-[#bdc2ff] text-sm font-medium mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location || job.state}
               </p>
             </div>
          </div>
        </div>
      </div>

      <main className="px-5 -mt-16 relative z-20 space-y-6">
        {/* Job Metrics Card */}
        <div className="bg-white rounded-[24px] shadow-[0_16px_32px_-12px_rgba(59,79,140,0.15)] p-6 border border-[#e2e8f0]">
           <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div>
                 <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1.5">Wage / Day</p>
                 <p className="text-xl font-black text-[#000666]">₹{job.wagePerDay}</p>
                 {job.wageFairnessStatus === "verified" && (
                   <span className="inline-block mt-1 text-[9px] font-black text-[#005312] uppercase tracking-wider bg-[#a0f399]/30 px-2 py-0.5 rounded">Verified Fair</span>
                 )}
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1.5">Duration</p>
                 <p className="text-xl font-black text-[#000666]">{job.durationDays} Days</p>
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1.5">Primary Skill</p>
                 <p className="text-sm font-bold text-[#1e293b]">{job.skillsRequired?.[0]}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1.5">Distance Req.</p>
                 <p className="text-sm font-bold text-[#1e293b]">Local (within {job.distanceKm || 15}km)</p>
              </div>
           </div>
           {job.description && (
             <div className="pt-5 border-t border-[#e2e8f0]">
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-2">Description</p>
                <p className="text-sm text-[#454652] leading-relaxed">{job.description}</p>
             </div>
           )}
           <div className="flex gap-2 pt-6 mt-2 border-t border-[#e2e8f0]">
              <button onClick={handleDeleteJob} className="flex-1 bg-[#fff1f2] text-[#ba1a1a] border border-[#ffdad6] py-3 rounded-xl font-bold text-sm hover:bg-[#ffe4e6] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
                <Trash2 className="w-4 h-4" /> Delete Job
              </button>
           </div>
        </div>

        {/* Verification & Scanner */}
        <div className="bg-white rounded-[24px] shadow-[0_16px_32px_-12px_rgba(59,79,140,0.15)] p-6 border border-[#e2e8f0]">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-[#a0f399]/30 rounded-full p-2 border border-[#a0f399]/50">
                <FileCheck2 className="w-5 h-5 text-[#005312]" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-[#1e293b] leading-tight font-lexend">Verify & Onboard</h2>
               <p className="text-[10px] uppercase font-black tracking-widest text-[#64748b] mt-0.5">Physical Site Check-in</p>
             </div>
          </div>
          <p className="text-sm text-[#454652] mb-4">Search workers below or scan their DL Card QR code to mark them present instantly.</p>
          
          {isScanning ? (
            <div className="mb-4 relative rounded-xl overflow-hidden bg-black border-2 border-[#000666]">
              <video ref={videoRef} className="w-full h-auto aspect-square object-cover" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                 <div className="absolute inset-0 border-2 border-[#a0f399]"></div>
              </div>
              <button onClick={stopScanner} className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80">
                <X className="w-5 h-5" />
              </button>
              <p className="absolute bottom-4 left-0 right-0 text-center text-white text-xs font-bold drop-shadow-md">Align QR Code within the frame</p>
            </div>
          ) : null}

          <div className="flex gap-2 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
               <Search className="w-4 h-4 text-[#94a3b8]" />
            </div>
            <input 
              type="text" 
              placeholder="Search or enter ID"
              value={addWorkerId}
              onChange={(e) => setAddWorkerId(e.target.value)}
              className="flex-1 bg-[#f8fafc] rounded-xl pl-9 pr-4 py-3 text-sm font-bold text-[#000666] focus:outline-none focus:ring-2 focus:ring-[#000666] transition-all border border-[#e2e8f0]"
            />
            {(!isScanning && !addWorkerId.trim()) ? (
              <button 
                onClick={startScanner}
                className="bg-[#3B4F8C] text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all inline-flex items-center justify-center min-w-[54px]"
                title="Scan QR"
              >
                <ScanLine className="w-5 h-5" />
              </button>
            ) : (
              <button 
                id="verify-submit-btn"
                onClick={handleManualAddWorker}
                disabled={addingWorker || !addWorkerId.trim()}
                className="bg-[#000666] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50 inline-flex items-center justify-center min-w-[100px]"
              >
                {addingWorker ? <CircleDashed className="w-5 h-5 animate-spin" /> : "Verify"}
              </button>
            )}
          </div>
        </div>

        {/* Present Workers (Verified) */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2 pt-2">
             <h2 className="text-lg font-black text-[#005312] font-lexend flex items-center gap-2">
               <UserCheck className="w-5 h-5" /> Verified & Present ({presentWorkers.length})
             </h2>
           </div>
           
           {presentWorkers.length > 0 ? (
             <div className="space-y-3">
               {presentWorkers.map((w: any, idx: number) => (
                 <div key={idx} className="bg-white rounded-2xl shadow-sm border border-[#a0f399]/50 overflow-hidden relative">
                   <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#005312] to-[#a0f399] opacity-70"></div>
                   <div className="p-5">
                       <div className="flex justify-between items-start">
                         <div className="flex gap-3 items-center">
                           <div className="w-10 h-10 rounded-full bg-[#005312]/10 flex items-center justify-center border border-[#005312]/20 shrink-0">
                             <UserRound className="w-5 h-5 text-[#005312]" />
                           </div>
                           <div>
                             <p className="font-bold text-[#1a1c1d] leading-none mb-1.5">{w.name}</p>
                             <p className="text-xs text-[#64748b] font-medium">{w.role}</p>
                           </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                             <Link href={`/verify/${w.workerId}`} className="text-[#3B4F8C] text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-[#3B4F8C]/5 rounded-md hover:bg-[#3B4F8C]/10 transition-colors border border-[#3B4F8C]/10">
                               View Card
                             </Link>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-dashed border-[#e2e8f0]">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-[#454652]">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {w.rating || "New Worker"}
                         </div>
                         <div className="text-xs font-bold text-[#454652] flex justify-end">
                            {w.experience || "0 jobs"}
                         </div>
                       </div>
    
                       <div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-[#e2e8f0]">
                          <button onClick={() => handleRemoveWorker(w)} className="bg-white text-[#ba1a1a] px-4 py-2.5 rounded-xl font-bold text-xs text-center border border-[#ffdad6] hover:bg-[#fff1f2] transition-colors shadow-sm active:scale-95">
                            Remove
                          </button>
                          <Link href={`/employer/issue-certificate`} className="flex-1 bg-[#000666] text-white py-2.5 rounded-xl font-bold text-xs text-center shadow-lg hover:bg-[#1A237E] transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                            <Award className="w-4 h-4" /> Issue Certificate
                          </Link>
                       </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="bg-white rounded-[24px] shadow-[0_12px_24px_rgba(0,0,0,0.04)] border border-[#e2e8f0] p-8 text-center text-[#64748b]">
               <div className="w-16 h-16 bg-[#f8fafc] border border-[#e2e8f0] rounded-full flex items-center justify-center mx-auto mb-4">
                 <UserCheck className="w-7 h-7 text-[#94a3b8]" />
               </div>
               <p className="font-bold mb-1 text-[#1e293b]">Nobody marked present yet</p>
               <p className="text-xs max-w-[200px] mx-auto">Scan worker QR codes above to verify their presence.</p>
             </div>
           )}
        </div>

        {/* Tentative Workers (Applied via App) */}
        {tentativeWorkers.length > 0 && (
          <div className="space-y-4 pt-4 border-t-[3px] border-[#e2e8f0]/40">
             <div className="flex items-center justify-between px-2 pt-2">
               <h2 className="text-lg font-black text-[#5e5e66] font-lexend flex items-center gap-2">
                 <Clock className="w-5 h-5 text-[#8f4e00]" /> Applied (Pending Scan) ({tentativeWorkers.length})
               </h2>
             </div>
  
             <div className="space-y-3">
                 {tentativeWorkers.map((w: any, idx: number) => (
                   <div key={idx} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-5 opacity-90">
                     <div className="flex justify-between items-start">
                       <div className="flex gap-3 items-center">
                         <div className="w-10 h-10 rounded-full bg-[#8f4e00]/10 flex items-center justify-center border border-[#8f4e00]/20 shrink-0">
                           <Clock className="w-5 h-5 text-[#8f4e00]" />
                         </div>
                         <div>
                           <p className="font-bold text-[#1a1c1d] leading-none mb-1.5">{w.name}</p>
                           <p className="text-xs text-[#64748b] font-medium">{w.role}</p>
                         </div>
                       </div>
                       <Link href={`/verify/${w.workerId}`} className="text-[#3B4F8C] text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-[#3B4F8C]/5 rounded-md hover:bg-[#3B4F8C]/10 transition-colors border border-[#3B4F8C]/10">
                         View Card
                       </Link>
                     </div>
                     
                     <div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-[#e2e8f0]">
                        <button onClick={() => handleRemoveWorker(w)} className="bg-white text-[#ba1a1a] px-4 py-2.5 rounded-xl font-bold text-xs text-center border border-[#ffdad6] hover:bg-[#fff1f2] transition-colors shadow-sm active:scale-95">
                          Reject
                        </button>
                        <button onClick={() => handleMarkPresent(w)} className="flex-1 bg-[#a0f399]/20 text-[#005312] border border-[#a0f399] py-2.5 rounded-xl font-bold text-xs text-center hover:bg-[#a0f399]/40 transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                          <UserCheck className="w-4 h-4" /> Mark as Present
                        </button>
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
