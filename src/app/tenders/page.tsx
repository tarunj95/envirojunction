import { tenders } from "@/lib/data";
import { TenderCard } from "./components/tender-card";

export default function TendersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
          Tenders & Bids
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Access the latest tenders from domestic and global platforms to find opportunities with governments and international organizations.
        </p>
      </header>

      <div className="space-y-4">
        {tenders.map((tender) => (
          <TenderCard key={tender.id} tender={tender} />
        ))}
      </div>
    </div>
  );
}
