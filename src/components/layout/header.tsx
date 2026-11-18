"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Search, Home, Briefcase, FileText, Newspaper, Users, Menu, PlusCircle, ShieldCheck, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/utils/auth";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tenders", label: "Tenders", icon: FileText },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/professionals", label: "Professionals", icon: Users },
];

function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [headerSearch, setHeaderSearch] = useState("");

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setHeaderSearch(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = headerSearch.trim();
    if (!query) return;

    if (['/jobs', '/tenders', '/news', '/professionals'].includes(pathname)) {
      router.push(`${pathname}?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/jobs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative flex-1">
      <Search
        onClick={handleSearchSubmit}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-[#00B660] transition-colors"
      />
      <Input
        type="search"
        placeholder="Search jobs, tenders, news, talent..."
        value={headerSearch}
        onChange={(e) => setHeaderSearch(e.target.value)}
        className="w-full rounded-xl bg-gray-50 border-gray-100 pl-10 pr-4 h-11 focus:ring-[#00B660] focus:border-[#00B660] text-sm"
      />
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const { role, isOrganisation, isAdmin, canPostJobs, badgeText, badgeColor } = useUserRole();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  const [localUser, setLocalUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const localUserStr = localStorage.getItem('user');
    if (localUserStr) {
      try {
        setLocalUser(JSON.parse(localUserStr));
      } catch (e) {
        console.error("Error parsing local user:", e);
      }
    }
  }, []);

  const userAvatarPic = user?.picture || localUser?.avatar || localUser?.picture || null;
  const userName = user?.name || localUser?.name || user?.nickname || localUser?.email || user?.email || "";
  const userInitial = (userName.trim()[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between gap-3 bg-white px-4 sm:px-6 md:px-12 shadow-sm border-none">
      <div className="flex items-center gap-3">
        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-700 hover:text-[#00B660] -ml-1">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-6 flex flex-col justify-between">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Mobile navigation links and account settings</SheetDescription>
            <div className="flex flex-col gap-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/Enviro Logo Green option ( Horizontal ) (1).svg" alt="EnviroJunction Logo" className="h-[1.5rem] w-auto" />
              </Link>
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                        isActive
                          ? "bg-[#E8F5E9] text-[#00B660] font-semibold"
                          : "text-[#666666] hover:bg-gray-50 hover:text-[#00B660]"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-[#00B660]" : "text-gray-400")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#00B660]"
              >
                <Avatar className="h-8 w-8">
                  {userAvatarPic && (
                    <AvatarImage
                      src={userAvatarPic}
                      alt={userName || "User avatar"}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <AvatarFallback className="bg-[#E8F5E9] text-[#00B660] font-bold text-sm">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{userName || "Profile"}</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left w-full cursor-pointer"
              >
                Log out
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 mr-2 sm:mr-4 md:mr-8">
          <img src="/Enviro Logo Green option ( Horizontal ) (1).svg" alt="EnviroJunction Logo" className="h-[1.5rem] w-auto max-w-[150px] sm:max-w-none" />
        </Link>
      </div>

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

      <div className="flex items-center gap-3 sm:gap-6 ml-auto justify-end w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Suspense fallback={
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search jobs, tenders, news, talent..."
              className="w-full rounded-xl bg-gray-50 border-gray-100 pl-10 pr-4 h-11 text-sm"
              readOnly
            />
          </div>
        }>
          <div className="flex-1 hidden sm:block">
            <HeaderSearch />
          </div>
        </Suspense>

        {/* Privileged Action for Admin only */}
        {isAdmin && (
          <Link href="/jobs" className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all whitespace-nowrap">
            <PlusCircle className="h-4 w-4" />
            <span>Post a Job</span>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 overflow-hidden ring-offset-2 hover:ring-2 hover:ring-[#00B660] transition-all">
              <Avatar className="h-11 w-11">
                {userAvatarPic && (
                  <AvatarImage
                    src={userAvatarPic}
                    alt={userName || "User avatar"}
                    referrerPolicy="no-referrer"
                  />
                )}
                <AvatarFallback className="bg-[#E8F5E9] text-[#00B660] font-bold text-lg">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl shadow-lg border-gray-100 p-2">
            <DropdownMenuLabel className="font-bold text-gray-900 pb-1">
              <div className="flex flex-col gap-1">
                <span className="truncate">{user?.name || localUser?.name || "My Account"}</span>
                {isAdmin && (
                  <span
                    className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-purple-600"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-green-50 focus:text-green-700">
              <Link href="/profile" className="flex w-full items-center">
                Profile
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-green-50 focus:text-green-700">
                  <Link href="/jobs" className="flex w-full items-center">Post a Job</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-green-50 focus:text-green-700">
                  <Link href="/tenders" className="flex w-full items-center">Publish Tender</Link>
                </DropdownMenuItem>
              </>
            )}
            {isAdmin && (
              <DropdownMenuItem className="cursor-pointer text-purple-700 font-semibold focus:bg-purple-50 focus:text-purple-800">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                Admin Controls
              </DropdownMenuItem>
            )}
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
