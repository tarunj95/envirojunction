import type { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Briefcase, CalendarDays } from "lucide-react";

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={job.logoUrl}
              alt={`${job.company} logo`}
              data-ai-hint={job.logoHint}
              fill
              className="rounded-md object-contain"
            />
          </div>
          <div className="md:hidden">
            <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <div className="flex-grow">
          <div className="hidden md:block">
            <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Posted: {job.postedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button variant="outline">View Details</Button>
          <Button>Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
