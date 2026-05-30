"use client";

import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isGrayBg = pathname?.startsWith("/jobs") || pathname?.startsWith("/profile") || pathname?.startsWith("/professionals") || pathname?.startsWith("/tenders");

  return (
    <div className={`flex min-h-svh w-full flex-col ${isGrayBg ? "bg-[#F8FAF9]" : ""}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      {!isHomePage && <Footer />}
    </div>
  );
}
