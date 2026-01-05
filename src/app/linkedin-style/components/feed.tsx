import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, Image as ImageIcon, FileText } from "lucide-react";
import { PostCard } from "./post-card";
import { Separator } from "@/components/ui/separator";

export function Feed() {
  const posts = [
    {
      author: "Nitesh Sahni",
      authorTitle: "Senior Software Engineer (L63) @ Microsoft | Ex-Salesforce | Ex-NatWest | E...",
      time: "1h",
      content: "I'm excited to share that I've joined Microsoft as a Senior Software Engineer 🚀\n\nGrateful for the opportunities, learnings, and support that helped me.",
      imageUrl: "https://picsum.photos/seed/microsoft/600/300",
      imageHint: "Microsoft logo",
      likes: "AKKASH TYAGI and 9 others",
      comments: "1 comment"
    },
    {
      author: "Suneera Madhani",
      authorTitle: "Founder & CEO of Worth AI | Founder of Billion Dollar Finte...",
      time: "Promoted",
      content: "Time for a hard truth... hiring mistakes can hold your business back. I've learned this lesson the hard way, and that's why I'm so passionate about helping other founders avoid the same pitfalls.",
      likes: "125",
      comments: "15 comments"
    },
  ];

  return (
    <main className="space-y-4">
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/avatar1/100/100" />
                        <AvatarFallback>TJ</AvatarFallback>
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

        <div className="space-y-4">
            {posts.map((post, index) => <PostCard key={index} post={post} />)}
        </div>
    </main>
  );
}
