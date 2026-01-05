import type { Professional } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Card className="flex h-full flex-col text-center transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="items-center">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint}/>
          <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-headline">{professional.name}</CardTitle>
        <p className="mt-1 text-sm font-medium text-accent">{professional.headline}</p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{professional.location}</span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {professional.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {professional.skills.length > 3 && (
            <Badge variant="outline">+{professional.skills.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
}
