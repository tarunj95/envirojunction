import type { NewsArticle } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CalendarDays } from "lucide-react";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            data-ai-hint={article.imageHint}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <Badge variant="secondary" className="mb-2 w-fit">{article.category}</Badge>
        <CardTitle className="mb-2 text-lg font-bold leading-tight font-headline">
          {article.title}
        </CardTitle>
        <CardDescription className="flex-grow text-sm text-muted-foreground">
          {article.summary}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 text-xs text-muted-foreground">
        <span>{article.source}</span>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          <span>{article.publishedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
