

'use client';

import React, { useState } from 'react';
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
        </div>

        {/* Card below Logo */}
        <Card className="border border-primary/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-xl text-left overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-500 via-primary to-teal-500" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-none font-semibold px-3 py-1">
                COMING SOON
              </Badge>
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome to Enviro Junction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-base leading-relaxed">
              Enviro Junction is an environmental intelligence platform that connects professionals, organizations, and communities through knowledge, opportunities, collaboration, and environmental solutions.
            </p>

            <div className="pt-2 border-t border-primary/5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Our Four Pillars</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['News', 'Opportunities', 'Tenders', 'Services'].map((pillar) => (
                  <div key={pillar} className="flex items-center justify-center p-2 rounded-lg bg-primary/5 border border-primary/10 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors duration-200">
                    {pillar}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground">Join Our Waitlist</h4>
                <p className="text-xs text-muted-foreground">Be the first to know when Enviro Junction launches.</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-bounce sm:animate-none">
                <span>👉 Join the Waitlist</span>
                <ArrowDown className="w-4 h-4 hidden sm:inline" />
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Card below Input Field */}
        <Card className="border border-primary/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-xl text-left overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 via-indigo-500 to-primary" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-1">
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border-none font-semibold px-3 py-1">
                Featured Webinar
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground leading-snug">
              Natural Resource Conservation in a Changing World: From Ecosystems to Sustainable Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-primary/5 p-3 rounded-lg border border-primary/10 text-sm">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>28 July 2026</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>11:00 AM (IST)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Online Webinar</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Join leading experts from academia, industry, consulting, and international organizations as they discuss emerging challenges, innovations, and practical pathways for sustainable natural resource management.
            </p>
          </CardContent>
        </Card>

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

