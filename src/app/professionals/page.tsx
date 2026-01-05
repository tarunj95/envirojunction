import { professionals } from "@/lib/data";
import { ProfessionalCard } from "./components/professional-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ProfessionalsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
          Find Professionals
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our network of dynamic environmental professionals available for freelance work and collaboration.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by name, skill, or location..." className="pl-10" />
        </div>
        <Button className="w-full md:w-auto">Search</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {professionals.map((prof) => (
          <ProfessionalCard key={prof.id} professional={prof} />
        ))}
      </div>
    </div>
  );
}
