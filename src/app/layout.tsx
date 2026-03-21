import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { LangProvider } from "@/components/LangProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { UserProvider } from "@/components/UserProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Lexend } from "next/font/google";
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shramik Setu",
  description: "A civic platform formalizing India's unorganized workforce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <LangProvider>
          <UserProvider>
            <GoogleTranslate />
            {children}
            <BottomNav />
          </UserProvider>
        </LangProvider>
      </body>
    </html>
  );
}
