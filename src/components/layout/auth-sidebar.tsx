"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const carouselItems = [
  {
    src: "/signup_bg.png",
    text: "There are over 175,000 candidates looking for great jobs!"
  },
  {
    src: "/signup_bg_2.png",
    text: "Connect with the most innovative sustainable companies."
  },
  {
    src: "/signup_bg_3.png",
    text: "Unlock opportunities in the green economy and clean tech."
  }
];

export function AuthSidebar() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden w-[45%] lg:block overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {carouselItems.map((item, idx) => (
          <div
            key={item.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              idx === currentIdx ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={item.src}
              alt={`Background ${idx + 1}`}
              fill
              className="object-cover brightness-50"
              priority={idx === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EnviroJunction Logo" className="h-12 w-auto brightness-200" />
        </Link>

        {/* Main Content */}
        <div className="mb-20">
          <div className="relative h-40">
            {carouselItems.map((item, idx) => (
              <h1
                key={`text-${idx}`}
                className={cn(
                  "absolute inset-0 text-4xl font-bold leading-tight md:text-5xl transition-all duration-1000 ease-in-out",
                  idx === currentIdx 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4 pointer-events-none"
                )}
              >
                {item.text}
              </h1>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,75,324</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">Live Job</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">97,354</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">Companies</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">7,532</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">New Jobs</div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-12 flex gap-2">
            {carouselItems.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentIdx ? "w-8 bg-white" : "w-8 bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
