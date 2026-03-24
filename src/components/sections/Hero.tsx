
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage?.imageUrl || ''}
          alt={heroImage?.description || 'AxiomFit Hero'}
          fill
          className="object-cover opacity-30 grayscale"
          data-ai-hint={heroImage?.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            Redefine <span className="text-accent italic font-light">Your</span> Limits.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-body leading-relaxed">
            Experience high-performance training engineered for the modern athlete. 
            AI-powered coaching, bespoke nutrition, and a global community of excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary text-background hover:bg-accent hover:scale-105 transition-all">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">
              Explore Programs
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        </div>
      </div>
    </section>
  );
}
