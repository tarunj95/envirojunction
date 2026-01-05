import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function RightSidebar() {
  const news = [
    { title: "OpenAI doubles down on audio AI", ago: "40m ago", readers: "12,540" },
    { title: "Phone makers to enter EV market", ago: "40m ago", readers: "2,785" },
    { title: "GEO to eclipse SEO", ago: "41m ago", readers: "2,470" },
    { title: "Brands shift to label-less packaging", ago: "41m ago", readers: "1,853" },
    { title: "Tesla yields EV mantle to BYD", ago: "40m ago", readers: "1,343" },
  ];

  const messages = [
      { name: 'Wafi Mikdar', text: 'Wafi: ok', time: 'Jan 4'},
      { name: 'HKU Business School...', text: 'Sponsored...', time: 'Jan 4'},
      { name: 'David Manley', text: 'Fullstack Engineer...', time: 'Dec 29, 2025'},
      { name: 'Daniela Petruza...', text: 'You: Merry Christmas...', time: 'Dec 25, 2025'},
      { name: 'Andrea Munoz', text: 'InMail: Mid-Senior...', time: 'Dec 25, 2025'},
  ]

  return (
    <aside className="sticky top-20 space-y-4 hidden lg:block">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">LinkedIn News</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <ul className="space-y-3">
                {news.map(item => (
                    <li key={item.title}>
                        <a href="#" className="group">
                            <h4 className="font-semibold text-sm group-hover:underline">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.ago} &bull; {item.readers} readers</p>
                        </a>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-2">
            <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">Messaging</CardTitle>
            </div>
             <div className="relative w-full pt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages" className="bg-secondary/50 border-none pl-10 h-9" />
            </div>
        </CardHeader>
        <CardContent className="p-2 pt-0">
            <ul className="space-y-1">
                {messages.map((msg) => (
                    <li key={msg.name}>
                        <a href="#" className="flex items-start gap-3 p-2 rounded hover:bg-secondary">
                           <Avatar className="h-10 w-10 border">
                             <AvatarImage src={`https://picsum.photos/seed/${msg.name}/40/40`} />
                             <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div className="flex-grow">
                             <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-sm">{msg.name}</p>
                                <p className="text-xs text-muted-foreground">{msg.time}</p>
                             </div>
                             <p className="text-xs text-muted-foreground truncate">{msg.text}</p>
                           </div>
                        </a>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
