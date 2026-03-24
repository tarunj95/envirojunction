"use client";
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLinkedInPage = pathname.startsWith('/linkedin-style');
  const isAuthPage = pathname === '/signup' || pathname === '/signin' || pathname === '/forgot-password';

  return (
    <html lang="en" suppressHydrationWarning className={cn(isLinkedInPage && 'dark-linkedin')}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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
