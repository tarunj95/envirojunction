import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Newspaper, Briefcase, FileText } from "lucide-react";
import { jobs, tenders } from "@/lib/data";
import { JobCard } from "./jobs/components/job-card";
import { TenderCard } from "./tenders/components/tender-card";
import { ProfileOverviewCard } from "./components/profile-overview-card";

export default function Home() {
  return (
    <div className="container mx-auto space-y-8 pt-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileOverviewCard />

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Briefcase className="text-accent" />
              Featured Job
            </CardTitle>
            <CardDescription>
              Explore career opportunities in the green industry.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <JobCard job={jobs[0]} />
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href="/jobs">
                Browse All Jobs <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="text-accent" />
              Recent Tender
            </CardTitle>
            <CardDescription>
              Find new projects and collaborations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <TenderCard tender={tenders[0]} />
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href="/tenders">
                See All Tenders <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
