"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthSidebar } from "@/components/layout/auth-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Image and Stats */}
      <AuthSidebar />

      {/* Right Side: Signup Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-[500px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">Create account.</h2>
            <p className="text-muted-foreground">
              Already have account?{' '}
              <Link href="/signin" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="First Name"
                  className="h-12 border-muted bg-white px-4 text-base focus-visible:ring-primary"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Last Name"
                  className="h-12 border-muted bg-white px-4 text-base focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 border-muted bg-white px-4 text-base focus-visible:ring-primary"
              />
            </div>

            <div className="relative space-y-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 border-muted bg-white px-4 pr-12 text-base focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative space-y-2">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="h-12 border-muted bg-white px-4 pr-12 text-base focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="border-muted data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I've read and agree with your{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Services
                </Link>
              </label>
            </div>

            <Button className="h-14 w-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button variant="outline" className="h-12 border-muted bg-white text-base font-medium hover:bg-muted/50">
              <svg className="mr-2 h-5 w-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              Sign up with LinkedIn
            </Button>
            <Button variant="outline" className="h-12 border-muted bg-white text-base font-medium hover:bg-muted/50">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
