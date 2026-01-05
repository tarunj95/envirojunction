import type { FreelanceProject } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, User } from "lucide-react";

export function FreelanceCard({ project }: { project: FreelanceProject }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{project.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <span className="font-semibold text-primary">{project.budget}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Due: {project.deadline}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <Button variant="outline" className="w-full sm:w-auto">View Project</Button>
      </CardFooter>
    </Card>
  );
}
