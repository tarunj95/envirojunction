
import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from './EJ LOGO FINAL.png'

export function EnviroLogo({ className }: { className?: string }) {
  const logo = PlaceHolderImages.find(img => img.id === 'enviro-logo');

  if (!logo) return null;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Image
        src={Logo}
        alt={logo.description}
        width={300}
        height={300}
        className="rounded-2xl shadow-sm"
        data-ai-hint={logo.imageHint}
        priority
      />
    </div>
  );
}
