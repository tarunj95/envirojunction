"use client";

import type { Professional } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfessionalCardProps {
  professional: Professional;
  isHighlighted?: boolean;
}

export function ProfessionalCard({ professional, isHighlighted = false }: ProfessionalCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card 
      className={`bg-white transition-all duration-300 hover:shadow-xl flex flex-col justify-between p-5 h-full border-2 ${
        isHighlighted 
          ? "border-[#1EC876]" 
          : "border-gray-200 hover:border-[#1EC876]"
      }`}
    >
      <CardContent className="p-0 flex flex-col h-full justify-between">
        <div>
          {/* Header: Avatar + Name / Title */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
              {!imgError && professional.avatarUrl ? (
                <Image
                  src={professional.avatarUrl}
                  alt={`${professional.name} avatar`}
                  data-ai-hint={professional.avatarHint}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold uppercase text-lg">
                  {professional.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-snug">
                {professional.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {professional.headline}
              </p>
            </div>
          </div>

          {/* Bio / Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porttitor massa tortor, vitae sodales enim maximus eget.
          </p>

          {/* Badges / Skills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {professional.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="outline"
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Footer: Location + View More button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">{professional.location}</span>
            </div>
            
            <Button 
              className="h-8 px-4 text-sm font-medium rounded-md shadow-none transition-colors bg-[#315D40]  hover:bg-[#19C26E] text-white"
            >
              View More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
