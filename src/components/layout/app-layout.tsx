"use client";

import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
