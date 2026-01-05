import Image from "next/image";
import { currentUser } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Pencil, Briefcase, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  const profileHero = PlaceHolderImages.find((img) => img.id === "profile-hero");

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full md:h-64">
          {profileHero && (
            <Image
              src={profileHero.imageUrl}
              alt="Profile banner"
              data-ai-hint={profileHero.imageHint}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="relative p-6">
          <div className="absolute -top-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint={currentUser.avatarHint} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <div className="pt-20">
            <h1 className="text-3xl font-bold text-primary font-headline">{currentUser.name}</h1>
            <p className="mt-1 text-lg text-foreground">{currentUser.headline}</p>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{currentUser.location}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{currentUser.about}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Briefcase className="text-accent" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser.experience.map((exp, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.period}</p>
                    <p className="mt-2 text-sm">{exp.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <GraduationCap className="text-accent" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser.education.map((edu, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <p className="text-sm text-muted-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.period}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {currentUser.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
