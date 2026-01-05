"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Leaf, LayoutDashboard, Newspaper, Briefcase, FileText, Lightbulb, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tenders", label: "Tenders", icon: FileText },
  { href: "/freelance", label: "Freelance", icon: Lightbulb },
  { href: "/professionals", label: "Professionals", icon: Users },
];


export function Header() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2 mr-4">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-primary font-headline hidden md:block">
            EnviroConnect
          </h1>
        </Link>
      <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
        {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/"))
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
        })}
      </nav>
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
