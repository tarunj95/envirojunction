import { newsArticles } from "@/lib/data";
import { NewsCard } from "./components/news-card";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
          Environmental News
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stay informed with the latest global, national, and regional events on environmental issues.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
