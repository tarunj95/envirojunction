
'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // Import the Image component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { saveLead } from '@/app/actions';
import { Loader2, Mail } from 'lucide-react';
import LogoImg from '../../public/EJ LOGO FINAL.png'
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Image */}
          <Image
            src={LogoImg}
            alt="Envirojunction Logo"
            width={300}
            height={300}
          />
          <h1 className="text-4xl font-bold tracking-tight">Coming Soon</h1>
        </div>
        
        <p className="text-muted-foreground text-lg">
          We're building a new way to connect communities with environmental action. 
          Join the waitlist to get early access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="email" 
              name="email"
              placeholder="Enter your email" 
              className="pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : 'Join Waiting List'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground pt-4">
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
