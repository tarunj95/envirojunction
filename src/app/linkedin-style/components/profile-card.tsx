import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Users, Newspaper, Calendar } from "lucide-react";
import Image from "next/image";

export function ProfileCard() {
  return (
    <aside className="sticky top-20 space-y-4">
      <Card className="overflow-hidden text-center">
        <div className="relative h-16 w-full">
            <Image src="https://picsum.photos/seed/p-banner/300/80" alt="profile banner" fill className="object-cover" />
        </div>
        <CardContent className="p-4 pt-0">
          <Avatar className="h-20 w-20 mx-auto -mt-10 mb-2 border-4 border-card">
            <AvatarImage src="https://picsum.photos/seed/avatar1/100/100" />
            <AvatarFallback>TJ</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold flex items-center justify-center gap-1">
            <span>Tarun Jajoria</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-primary">
              <path d="M13.635 13.635H11.08V9.86c0-.899-.018-2.055-1.252-2.055-1.252 0-1.446.978-1.446 1.989v3.841H5.83V6.26h2.44v1.118h.036a2.671 2.671 0 0 1 2.404-1.25c2.572 0 3.048 1.693 3.048 3.896v3.61Z M3.593 5.143a1.543 1.543 0 1 1 0-3.086 1.543 1.543 0 0 1 0 3.086ZM2.365 13.635h2.46V6.26h-2.46v7.375Z M14.885 2.365a2.365 2.365 0 0 0-2.365-2.365H3.48a2.365 2.365 0 0 0-2.365 2.365v11.27a2.365 2.365 0 0 0 2.365 2.365h11.405a2.365 2.365 0 0 0 2.365-2.365V2.365Z"></path>
            </svg>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            AI Engineer | Built AI RegTech Dashboard 40% Faster | Scalabi...
          </CardDescription>
        </CardContent>
        <Separator />
        <div className="p-4 text-xs text-muted-foreground space-y-2 text-left">
            <div className="flex justify-between items-center">
                <span>Profile viewers</span>
                <span className="text-primary font-semibold">186</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Post impressions</span>
                <span className="text-primary font-semibold">41</span>
            </div>
        </div>
        <Separator />
        <div className="p-2 text-left">
            <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-yellow-400">
                  <path d="M12.923 2.053H3.077a.923.923 0 0 0-.923.923v10a.923.923 0 0 0 .923.923h9.846a.923.923 0 0 0 .923-.923V2.976a.923.923 0 0 0-.923-.923Z"></path>
              </svg>
              <span className="text-xs font-semibold">Your Premium features</span>
            </a>
        </div>
      </Card>
      <Card>
          <CardContent className="p-2 text-sm">
            <ul className="space-y-1">
                <li><a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-secondary">
                    <Bookmark className="w-4 h-4 text-muted-foreground" /> <span>Saved items</span>
                </a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-secondary">
                    <Users className="w-4 h-4 text-muted-foreground" /> <span>Groups</span>
                </a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-secondary">
                    <Newspaper className="w-4 h-4 text-muted-foreground" /> <span>Newsletters</span>
                </a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-secondary">
                    <Calendar className="w-4 h-4 text-muted-foreground" /> <span>Events</span>
                </a></li>
            </ul>
          </CardContent>
      </Card>
    </aside>
  );
}
