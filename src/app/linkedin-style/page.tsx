import { Search, Home, Users, Briefcase, MessageSquare, Bell, Grid, User, ThumbsUp, MessageCircle, Repeat, Send, MoreHorizontal, Video, Image as ImageIcon, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "./components/profile-card";
import { Feed } from "./components/feed";
import { RightSidebar } from "./components/right-sidebar";

export default function LinkedInStylePage() {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 fill-white" aria-hidden="true">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.62 1.62 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="bg-secondary/50 border-none pl-10 h-9" />
            </div>
          </div>
          <nav className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none border-b-2 border-primary text-primary">
              <Home className="h-6 w-6" />
              <span>Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none">
              <Users className="h-6 w-6" />
              <span>My Network</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none">
              <Briefcase className="h-6 w-6" />
              <span>Jobs</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none">
              <MessageSquare className="h-6 w-6" />
              <span>Messaging</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none">
              <Bell className="h-6 w-6" />
              <span>Notifications</span>
            </Button>
             <div className="h-14 flex items-center border-l border-border ml-2 pl-2">
                <Button variant="ghost" className="flex flex-col h-full px-3 text-xs justify-center items-center gap-1 rounded-none">
                    <Grid className="h-6 w-6" />
                    <span>For Business</span>
                </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-20 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_320px] gap-6 items-start">
        <ProfileCard />
        <Feed />
        <RightSidebar />
      </main>
    </div>
  );
}
