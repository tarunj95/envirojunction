
'use client';

import React, { useState } from 'react';
import { saveLead } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

export function LeadCapture() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await saveLead(formData);

    if (result.success) {
      toast({
        title: "Welcome to AxiomFit!",
        description: "You've successfully joined our elite community waitlist.",
      });
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: result.error || "Something went wrong. Please try again.",
      });
    }
    
    setIsSubmitting(false);
  }

  return (
    <section id="community" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black mb-6 leading-tight">Join the <span className="text-accent">Inner Circle.</span></h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Be the first to know about new training protocols, exclusive retreats, 
              and the upcoming beta launch of our integrated performance wearables.
            </p>
            <ul className="space-y-4">
              {['Early access to mobile app', 'Weekly elite performance reports', 'Global community networking'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-10 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-accent" />
              Secure Your Spot
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Alex Rivers" 
                  className="bg-background/50 h-12 border-white/10 focus:border-accent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">Work Email</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="alex@example.com" 
                  className="bg-background/50 h-12 border-white/10 focus:border-accent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-primary text-background hover:bg-accent transition-all mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : 'Join the Community'}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By joining, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
