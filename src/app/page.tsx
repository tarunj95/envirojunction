import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobs, tenders, newsArticles, freelanceProjects } from "@/lib/data";
import { JobCard } from "./jobs/components/job-card";
import { TenderCard } from "./tenders/components/tender-card";
import { ProfileOverviewCard } from "./components/profile-overview-card";
import { NewsCard } from "./news/components/news-card";
import { FreelanceCard } from "./freelance/components/freelance-card";
import { RightSidebar } from "./components/right-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Video, Image as ImageIcon, FileText, Forward } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
                <CardContent className="p-4">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="person face" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Input placeholder="Start a post" className="flex-grow rounded-full h-12 bg-secondary/50 border-border hover:bg-muted" />
                    </div>
                    <div className="flex justify-around mt-4">
                        <Button variant="ghost" className="text-muted-foreground">
                            <Video className="w-5 h-5 text-blue-500" /> <span className="ml-2">Video</span>
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground">
                            <ImageIcon className="w-5 h-5 text-green-500" /> <span className="ml-2">Photo</span>
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground">
                            <FileText className="w-5 h-5 text-orange-500" /> <span className="ml-2">Write article</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-2">
                <Separator className="flex-grow" />
                <span className="text-xs text-muted-foreground">Sort by: Top</span>
            </div>

           <Card className="p-0 shadow-none border-none bg-transparent">
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
