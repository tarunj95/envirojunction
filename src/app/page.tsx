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
import { jobs, tenders, newsArticles, freelanceProjects } from "@/lib/data";
import { JobCard } from "./jobs/components/job-card";
import { TenderCard } from "./tenders/components/tender-card";
import { ProfileOverviewCard } from "./components/profile-overview-card";
import { NewsCard } from "./news/components/news-card";
import { FreelanceCard } from "./freelance/components/freelance-card";

export default function Home() {
  const feedItems = [
    ...jobs.map((item) => ({ type: "job", date: new Date(item.postedDate), data: item })),
    ...newsArticles.map((item) => ({ type: "news", date: new Date(item.publishedDate), data: item })),
    // Tenders and freelance don't have post dates, so we'll use deadline for now.
    ...tenders.map((item) => ({ type: "tender", date: new Date(), data: item })),
    ...freelanceProjects.map((item) => ({ type: "freelance", date: new Date(), data: item })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="container mx-auto space-y-8 pt-8">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-[250px_1fr_300px]">
        <div className="hidden lg:block">
          <ProfileOverviewCard />
        </div>

        <div className="space-y-4 md:col-span-2 lg:col-span-1">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Activity Feed</CardTitle>
              <CardDescription>
                The latest jobs, news, and opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
              {feedItems.map((item, index) => {
                if (item.type === 'job') {
                  return <JobCard key={`job-${index}`} job={item.data as any} />;
                }
                if (item.type === 'news') {
                  return <NewsCard key={`news-${index}`} article={item.data as any} />;
                }
                if (item.type === 'tender') {
                  return <TenderCard key={`tender-${index}`} tender={item.data as any} />;
                }
                if (item.type === 'freelance') {
                  return <FreelanceCard key={`freelance-${index}`} project={item.data as any} />;
                }
                return null;
              })}
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:block">
          <Card>
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
    </div>
  );
}
