"use client"
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import Script from 'next/script';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLinkedInPage = pathname.startsWith('/linkedin-style');
  const isAuthPage = pathname.startsWith('/signup') || pathname.startsWith('/signin') || pathname.startsWith('/forgot-password');

  useEffect(() => {
    const authRoutes = ['/signin', '/signup', '/forgot-password'];
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/';
    const isOnAuthPage = authRoutes.some(route => currentPath === route || currentPath.startsWith(`${route}/`));
    const isAuthHandler = currentPath.startsWith('/auth/') || currentPath.startsWith('/api/');

    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const hasAuthCookie = document.cookie.includes('token') || 
                            document.cookie.includes('appSession') || 
                            document.cookie.includes('user_exists');
      const isAuthenticated = Boolean(user || token || hasAuthCookie);

      // If user is logged out and lands on root "/" or protected route, route to /signin
      if (!isAuthenticated && !isOnAuthPage && !isAuthHandler) {
        window.location.href = '/signin';
        return;
      }

      // If already logged in and visits auth page, route to profile
      if (isOnAuthPage && (user || token)) {
        window.location.href = '/profile';
        return;
      }
    } catch (e) {
      console.error('Error checking authentication state', e);
    }
  }, [pathname]);


  return (
    <html lang="en" suppressHydrationWarning className={cn(isLinkedInPage && 'dark-linkedin')}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Auth0Provider>
          {isLinkedInPage || isAuthPage ? (
            <div className="bg-background min-h-screen">
              {children}
            </div>
          ) : (
            <AppLayout>
              {children}
            </AppLayout>
          )}
        </Auth0Provider>
        <Toaster />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" id="google-gsi-client" />
      </body>
    </html>
  );
}