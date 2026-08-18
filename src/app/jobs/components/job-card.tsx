"use client";

import type { Job } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function JobCard({ job, viewMode = 'list' }: { job: Job, viewMode?: 'list' | 'grid' }) {
  const percentApplied = job.applied && job.capacity ? Math.round((job.applied / job.capacity) * 100) : 0;
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="transition-shadow duration-300 hover:shadow-xl h-full">
      <CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-5 h-full">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 border border-border rounded-md bg-background">
          <div className="relative h-10 w-10 flex items-center justify-center bg-muted rounded-md">
            {!imgError && job.logoUrl ? (
              <Image
                src={job.logoUrl}
                alt={`${job.company} logo`}
                data-ai-hint={job.logoHint}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xl font-bold text-muted-foreground uppercase">
                {job.company.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex-grow">
          <Link href={`/jobs/${job.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg hover:text-emerald-700 transition-colors">{job.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {job.company} • {job.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">
              {job.type}
            </Badge>
            {job.tags?.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="rounded-full"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right: Apply & Progress */}
        <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 md:w-36 ml-auto mt-4 md:mt-0">
          <Link href={`/jobs/${job.id}`} className="w-full">
            <Button className="w-full">Apply</Button>
          </Link>
          <Button variant="outline" className="w-full">Save Job</Button>
          {job.applied !== undefined && job.capacity !== undefined && (
            <div className="w-full text-center mt-1">
              <p className="text-xs text-muted-foreground font-light">
                {job.applied} applied
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
