
import React from 'react';

export function AxiomLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-headline font-bold text-2xl tracking-tighter ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        <path
          d="M50 5L95 85H5L50 5Z"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="55" r="10" fill="currentColor" />
      </svg>
      <span className="text-primary">Axiom</span>
      <span className="text-accent">Fit</span>
    </div>
  );
}
