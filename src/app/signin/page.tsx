"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthSidebar } from "@/components/layout/auth-sidebar";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import { handleSocialLogin } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        email,
        password
      };
      
      const response = await api.post('/auth/login', payload);
      console.log('Signin success:', response.data);
      
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Redirect to the dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Signin error:', error);
      // Optional: Display error toast to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      {/* Right Side: Signin Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-[500px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="text-muted-foreground">
              Don't have account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-muted bg-white px-4 text-base focus-visible:ring-primary"
              />
            </div>

            <div className="relative space-y-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-muted data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forget password
              </Link>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="h-14 w-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
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

          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-muted bg-white hover:bg-muted/50 text-[#0077B5]"
              onClick={() => handleSocialLogin('linkedin')}
              type="button"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="sr-only">Sign in with LinkedIn</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-muted bg-white hover:bg-muted/50"
              onClick={() => handleSocialLogin('google')}
              type="button"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="sr-only">Sign in with Google</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-muted bg-white hover:bg-muted/50 text-[#1877F2]"
              onClick={() => handleSocialLogin('facebook')}
              type="button"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="sr-only">Sign in with Facebook</span>
            </Button>
{/* Instagram — disabled until Auth0 Instagram connection is configured
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-muted bg-white hover:bg-muted/50 text-[#E4405F]"
              onClick={() => handleSocialLogin('instagram')}
              type="button"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
              <span className="sr-only">Sign in with Instagram</span>
            </Button>
*/}
          </div>
        </div>
      </div>
    </div>
  );
}
