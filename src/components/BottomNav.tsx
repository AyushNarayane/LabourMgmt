"use client";

import React from "react";
import Link from "next/link";
import { Home, CreditCard, Briefcase, BookOpen, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/worker" },
  { label: "Card", icon: CreditCard, href: "/card" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Schemes", icon: BookOpen, href: "/schemes" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on landing page, employer pages, or register
  if (pathname === "/" || pathname.startsWith("/employer") || pathname === "/register") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#eeeef0] z-50 px-2 pb-1 pt-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]
                ${isActive
                  ? "text-[#3B4F8C] bg-[#3B4F8C]/10"
                  : "text-[#767683] hover:text-[#454652]"
                } transform transition-all duration-200 active:scale-95`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
