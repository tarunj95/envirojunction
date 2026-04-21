"use client";
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLinkedInPage = pathname.startsWith('/linkedin-style');
  const isAuthPage = pathname === '/signup' || pathname === '/signin' || pathname === '/forgot-password';

  useEffect(() => {
    // Auth0 SDK handles token exchange and session at /auth/callback automatically.
    // We only need to redirect authenticated users away from auth pages.
    // The session is stored in an HttpOnly cookie managed by Auth0's route handler.
    const authRoutes = ['/signin', '/signup', '/forgot-password'];
    const isOnAuthPage = authRoutes.some(route =>
      window.location.pathname.startsWith(route)
    );

    if (isOnAuthPage) {
      // Check Auth0 session via /auth/me endpoint
      fetch('/auth/me')
        .then(res => {
          if (res.ok) {
            // User is already logged in — send them to the dashboard
            window.location.href = '/';
          }
        })
        .catch(() => {
          // Not authenticated — stay on the auth page
        });
    }
  }, []);


  return (
    <html lang="en" suppressHydrationWarning className={cn(isLinkedInPage && 'dark-linkedin')}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {isLinkedInPage || isAuthPage ? (
          <div className="bg-background min-h-screen">
            {children}
          </div>
        ) : (
          <AppLayout>
            {children}
          </AppLayout>
        )}
        <Toaster />
      </body>
    </html>
  );
}
