"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
import { Search, Home, Briefcase, FileText, Lightbulb, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/utils/auth";
import { useUser } from "@auth0/nextjs-auth0/client";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tenders", label: "Tenders", icon: FileText },
  { href: "/freelance", label: "Freelance", icon: Lightbulb },
  { href: "/professionals", label: "Professionals", icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center gap-4 bg-white px-6 md:px-12 shadow-sm border-none">
      <Link href="/" className="flex items-center gap-2 mr-8">
        <img src="/logo.png" alt="EnviroJunction Logo" className="h-12 w-auto" />
      </Link>
      
      <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "flex items-center gap-2 px-1 py-2 transition-colors relative",
                isActive
                  ? "text-[#00B660] font-semibold"
                  : "text-[#666666] hover:text-[#00B660]"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-[#00B660]" : "text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-6 ml-auto w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full rounded-xl bg-gray-50 border-gray-100 pl-10 pr-4 h-11 focus:ring-[#00B660] focus:border-[#00B660] text-sm"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 overflow-hidden ring-offset-2 hover:ring-2 hover:ring-[#00B660] transition-all">
              <Avatar className="h-11 w-11">
                {user?.picture ? (
                  <AvatarImage src={user.picture} alt={user.name || "User avatar"} />
                ) : userAvatar ? (
                  <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />
                ) : null}
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border-gray-100">
            <DropdownMenuLabel className="font-bold text-gray-900">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-green-50 focus:text-green-700">
              <Link href="/profile" className="flex w-full items-center">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-green-50 focus:text-green-700">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 font-medium">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
