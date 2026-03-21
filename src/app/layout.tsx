import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { LangProvider } from "@/components/LangProvider";
import GoogleTranslate from "@/components/GoogleTranslate";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <LangProvider>
          <GoogleTranslate />
          {children}
          <BottomNav />
        </LangProvider>
      </body>
    </html>
  );
}
