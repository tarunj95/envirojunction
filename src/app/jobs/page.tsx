import { jobs } from "@/lib/data";
import { JobCard } from "./components/job-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
          Job Board
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find internships and jobs in waste management, clean energy, green architecture, and more across India.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by title or keyword..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto">Search</Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
