"use client";

import React from "react";
import { Header } from "./header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
