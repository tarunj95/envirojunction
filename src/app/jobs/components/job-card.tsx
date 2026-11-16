"use client";

import type { Job } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getJobEnvironmentalTags } from "@/utils/environmentalTags";

export function JobCard({ job, viewMode = 'list' }: { job: Job, viewMode?: 'list' | 'grid' }) {
  const percentApplied = job.applied && job.capacity ? Math.round((job.applied / job.capacity) * 100) : 0;
  const [imgError, setImgError] = useState(false);

  const displayTags = (job.tags && job.tags.length > 0)
    ? job.tags
    : getJobEnvironmentalTags({
        title: job.title,
        description: job.description,
        company: job.company,
        type: job.type,
      });

  return (
    <Card className="transition-shadow duration-300 hover:shadow-xl h-full border border-gray-200">
      <CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-5 h-full">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 border border-emerald-100 rounded-xl bg-emerald-50 text-[#315D40] font-bold text-xl uppercase select-none">
          {job.company ? job.company.charAt(0).toUpperCase() : "J"}
        </div>

        {/* Middle: Details */}
        <div className="flex-grow min-w-0">
          <Link href={`/jobs/${job.id}`} scroll={true} className="hover:underline">
            <h3 className="font-semibold text-lg hover:text-emerald-700 transition-colors truncate">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">{job.company}</span> • {job.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-[#315D40] border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {job.type}
            </Badge>
            <Badge variant="outline" className="bg-emerald-50/40 text-emerald-800 border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {job.type === "Full-Time" ? "₹50k - ₹80k / mo" : "₹15k - ₹25k / mo"}
            </Badge>
            {displayTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="rounded-full px-2.5 py-0.5 text-xs font-normal border-gray-200 text-gray-600 bg-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right: Apply & Progress */}
        <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 md:w-36 ml-auto mt-4 md:mt-0">
          <Link href={`/jobs/${job.id}`} scroll={true} className="w-full">
            <Button className="w-full bg-[#315D40] hover:bg-[#254A32] text-white">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
