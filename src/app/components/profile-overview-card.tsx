import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Users, Newspaper, Calendar } from "lucide-react";
import Image from "next/image";

export function ProfileOverviewCard() {
  return (
    <aside className="space-y-4">
    <Card className="overflow-hidden text-center">
        <div className="relative h-16 w-full">
            <Image src="https://picsum.photos/seed/p-banner/300/80" alt="profile banner" layout="fill" objectFit="cover" />
        </div>
        <CardContent className="p-4 pt-0">
        <Avatar className="h-20 w-20 mx-auto -mt-10 mb-2 border-4 border-card">
            <AvatarImage src="https://picsum.photos/seed/tarun/100/100" />
            <AvatarFallback>TJ</AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-1">
            <span>Tarun Jajoria</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
            AI Engineer | Built AI RegTech Dashboard 40% Faster | Scalabl...
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground mt-1">
            London Area, United Kingdom
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
