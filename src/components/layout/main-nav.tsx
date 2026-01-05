"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Newspaper,
  Briefcase,
  FileText,
  Users,
  Lightbulb,
  User,
  LogOut,
  Leaf,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tenders", label: "Tenders", icon: FileText },
  { href: "/freelance", label: "Freelance", icon: Lightbulb },
  { href: "/professionals", label: "Professionals", icon: Users },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">
            EnviroConnect
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <Separator className="my-2" />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname === "/profile"} tooltip="Profile">
              <Link href="/profile">
                <User />
                <span>My Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out">
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
