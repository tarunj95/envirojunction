"use client";

import React from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "./main-nav";
import { Header } from "./header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <MainNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
