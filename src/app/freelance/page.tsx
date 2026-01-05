import { freelanceProjects } from "@/lib/data";
import { FreelanceCard } from "./components/freelance-card";

export default function FreelancePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
          Freelance Opportunities
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with clients and find projects that match your skills and interests.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {freelanceProjects.map((project) => (
          <FreelanceCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
