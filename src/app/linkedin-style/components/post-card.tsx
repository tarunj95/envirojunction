import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Repeat, Send, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface Post {
    author: string;
    authorTitle: string;
    time: string;
    content: string;
    imageUrl?: string;
    imageHint?: string;
    likes: string;
    comments: string;
}


export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden">
        <CardHeader className="p-4">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${post.author}/40/40`} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-4">
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
                 <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border">
                    <Image src={post.imageUrl} alt={post.imageHint || "Post image"} layout="fill" objectFit="cover" data-ai-hint={post.imageHint} />
                </div>
            )}
        </CardContent>
        <div className="px-4 py-2 text-xs text-muted-foreground flex justify-between">
            <span>{post.likes}</span>
            <span>{post.comments}</span>
        </div>
        <Separator />
        <CardFooter className="p-1">
            <div className="flex justify-around w-full">
                <Button variant="ghost" className="text-muted-foreground flex-1">
                    <ThumbsUp className="w-5 h-5" /> <span className="ml-2 hidden sm:inline">Like</span>
                </Button>
                 <Button variant="ghost" className="text-muted-foreground flex-1">
                    <MessageCircle className="w-5 h-5" /> <span className="ml-2 hidden sm:inline">Comment</span>
                </Button>
                 <Button variant="ghost" className="text-muted-foreground flex-1">
                    <Repeat className="w-5 h-5" /> <span className="ml-2 hidden sm:inline">Repost</span>
                </Button>
                 <Button variant="ghost" className="text-muted-foreground flex-1">
                    <Send className="w-5 h-5" /> <span className="ml-2 hidden sm:inline">Send</span>
                </Button>
            </div>
        </CardFooter>
    </Card>
  );
}
