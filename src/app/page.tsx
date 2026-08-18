

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Image component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { saveLead } from '@/app/actions';
import { Loader2, Mail, Instagram, Linkedin, Youtube, Calendar, Clock, Laptop, ArrowDown, Sparkles } from 'lucide-react';
import LogoImg from '../../public/EJ LOGO_Final.svg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // target time: 18 Aug 2026 at 1 PM IST
    const targetDate = new Date('2026-08-18T13:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await saveLead(formData);

    if (result.success) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as Envirojunction launches.",
      });
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: result.error || "Please try again later.",
      });
    }
    
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-background to-background/95">
      <div className="max-w-xl w-full space-y-8 my-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo Image */}
          <div className="relative hover:scale-105 transition-transform duration-300">
            <Image
              src={LogoImg}
              alt="Envirojunction Logo"
              width={260}
              height={260}
              priority
            />
          </div>
          
          {/* Countdown Timer */}
          {isMounted && (
            <div className="flex gap-2 sm:gap-4 justify-center items-center mt-2 w-full">
              <div className="flex flex-col items-center p-2 sm:p-3 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-sm backdrop-blur-md min-w-[60px] sm:min-w-[70px] border border-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{timeLeft.days}</span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-muted-foreground">Days</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary/40 animate-pulse">:</span>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-sm backdrop-blur-md min-w-[60px] sm:min-w-[70px] border border-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-muted-foreground">Hours</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary/40 animate-pulse">:</span>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-sm backdrop-blur-md min-w-[60px] sm:min-w-[70px] border border-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-muted-foreground">Mins</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary/40 animate-pulse">:</span>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-sm backdrop-blur-md min-w-[60px] sm:min-w-[70px] border border-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-muted-foreground">Secs</span>
              </div>
            </div>
          )}
        </div>



        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-white/30 dark:bg-zinc-900/30 p-4 rounded-xl border border-primary/5 backdrop-blur-sm">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="email" 
              name="email"
              placeholder="Enter your email address" 
              className="pl-10 h-12 bg-white/70 dark:bg-zinc-950/70 border-primary/20 focus:border-primary text-base"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : 'Join Waiting List'}
          </Button>
        </form>


        {/* Social Links */}
        <div className="flex justify-center space-x-6 pt-2">
          <a 
            href="https://www.instagram.com/envirojunction/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-primary/5"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://www.linkedin.com/company/enviro-junction/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-primary/5"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a 
            href="https://www.youtube.com/@EnviroJunction" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-primary/5"
            aria-label="YouTube"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          © 2026 Envirojunction. Sustainable communities start here.
        </p>
      </div>

      {/* Decorative background blur */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      </div>
    </main>
  );
}

