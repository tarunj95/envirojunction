
import React from 'react';
import { AxiomLogo } from '@/components/AxiomLogo';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <AxiomLogo />
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#ai-coach" className="hover:text-accent transition-colors">AI Coach</a>
            <a href="#community" className="hover:text-accent transition-colors">Community</a>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background">
              Sign In
            </Button>
            <Button className="bg-primary text-background hover:bg-accent transition-all">
              Join Now
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
