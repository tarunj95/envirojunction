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
import { RightSidebar } from "./components/right-sidebar";

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
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[250px_1fr_320px]">
        <div className="hidden lg:block">
          <ProfileOverviewCard />
        </div>

        <div className="space-y-4">
           <Card>
            <CardContent className="space-y-4 p-0">
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

        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
