"use client";

import React from 'react';
import Link from 'next/link';
import { AuthSidebar } from "@/components/layout/auth-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      {/* Right Side: Forgot Password Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-[500px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">Forgot Password</h2>
            <p className="text-muted-foreground text-lg">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 border-muted bg-white px-4 text-base focus-visible:ring-primary"
              />
            </div>

            <Button className="h-14 w-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90">
              Send Reset Link
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="flex justify-center pt-4">
             <Link 
               href="/signin" 
               className="flex items-center gap-2 font-semibold text-primary hover:underline hover:text-primary/80 transition-all"
             >
                <ArrowLeft className="h-4 w-4" />
                Go Back to Sign In
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
