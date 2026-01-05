import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

export function RightSidebar() {
    const news = [
        { title: "Global Carbon Emissions Reach New High", ago: "1d ago", readers: "15,230" },
        { title: "Breakthrough in Solar Panel Efficiency", ago: "2d ago", readers: "12,104" },
        { title: "India Launches Ambitious Reforestation Project", ago: "3d ago", readers: "9,845" },
        { title: "New Policies to Combat Plastic Pollution", ago: "4d ago", readers: "7,541" },
        { title: "Report on Declining Biodiversity", ago: "5d ago", readers: "5,123" },
    ];

    const suggestions = [
        { 
            name: "GreenTech Solutions", 
            type: "Company", 
            category: "Clean Energy",
            logoUrl: "https://picsum.photos/seed/logo1/40/40",
            logoHint: "company logo"
        },
        { 
            name: "Waste Warriors", 
            type: "Group", 
            category: "Waste Management",
            logoUrl: "https://picsum.photos/seed/group1/40/40",
            logoHint: "group logo"
        },
        { 
            name: "Sustainable Builders", 
            type: "Company", 
            category: "Green Architecture",
            logoUrl: "https://picsum.photos/seed/logo3/40/40",
            logoHint: "company logo"
        },
    ];

    return (
        <aside className="sticky top-20 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold font-headline">Latest News</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <ul className="space-y-3">
                        {news.slice(0,5).map(item => (
                            <li key={item.title}>
                                <a href="#" className="group">
                                    <h4 className="font-semibold text-sm group-hover:underline">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.ago} &bull; {item.readers} readers</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                     <Button variant="link" className="text-primary p-0 h-auto mt-3 text-sm">Show more</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold font-headline">Suggestions For You</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {suggestions.map(item => (
                        <div key={item.name} className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border rounded-md">
                                <AvatarImage src={item.logoUrl} data-ai-hint={item.logoHint} />
                                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.type} &bull; {item.category}</p>
                                <Button variant="outline" size="sm" className="mt-2 h-8">
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Follow
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-bl-md font-semibold">Promoted</div>
                <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Explore relevant opportunities with top environmental firms.
                    </p>
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                           <AvatarImage src="https://picsum.photos/seed/user-promo/100/100" data-ai-hint="person face" />
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-12 w-12 border rounded-md">
                           <AvatarImage src="https://picsum.photos/seed/company-promo/100/100" data-ai-hint="company logo" />
                           <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                    </div>
                     <Button>Follow Now</Button>
                </CardContent>
                <div className="px-4 py-2 bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Get the latest jobs and industry news.</p>
                </div>
            </Card>

            <footer className="text-center text-xs text-muted-foreground space-x-3">
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Accessibility</a>
                <a href="#" className="hover:underline">Help Center</a>
            </footer>
        </aside>
    );
}
