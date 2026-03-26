"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { currentUser } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Check,
  MoreHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Play
} from "lucide-react";


export default function ProfilePage() {
  const [bgStyle, setBgStyle] = useState({});

  useEffect(() => {
    const generateColor = () => `hsl(${Math.random() * 360}, 60%, 85%)`;
    const color1 = generateColor();
    const color2 = generateColor();
    setBgStyle({
      background: `linear-gradient(${Math.random() * 360}deg, ${color1}, ${color2})`,
    });
  }, []);



  return (
    <div className="min-h-screen py-8 px-4 md:px-8 transition-colors duration-1000 ">
      <div className="max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="h-48 w-full transition-all duration-1000" style={bgStyle} />
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <Avatar className="h-40 w-40 border-4 border-background rounded-lg overflow-hidden">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} className="object-cover" />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="pt-28 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#191919]">{currentUser.name}</h1>
                  <p className="text-md text-[#666666] font-medium">{currentUser.headline}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-[#666666]">
                    <span>{currentUser.location}</span>
                    <span className="text-[#666666]">·</span>
                    <span className="text-[#666666]">{currentUser.followers} followers</span>
                    <span className="text-[#666666]">·</span>
                    <span className="text-[#666666]">{currentUser.employees} employees</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="bg-[#336644] hover:bg-[#2d5a3c] text-white rounded-full px-6 flex items-center gap-2">
                    <Send className="h-4 w-4 rotate-[-45deg]" />
                    Message
                  </Button>
                  <Button variant="outline" className="border-[#336644] text-[#336644] hover:bg-[#336644]/10 rounded-full px-6 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Following
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-[#666666]">
                    <MoreHorizontal className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-8 flex items-center border-b">
                {['Home', 'About', 'Jobs', 'People'].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-4 py-3 text-sm font-semibold transition-colors relative ${i === 0 ? 'text-[#336644]' : 'text-[#666666] hover:text-[#191919]'
                      }`}
                  >
                    {tab}
                    {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#336644]" />}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-[#191919]">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#666666] text-md leading-relaxed whitespace-pre-line">
                {currentUser.about}
              </p>
            </CardContent>
            <div className="border-t py-4 text-center">
              <button className="text-[#666666] hover:text-[#191919] font-semibold text-sm flex items-center justify-center gap-2 mx-auto">
                Show all details <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Profile Posts */}
          <Card className="border-none shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#191919]">Profile Posts</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 border border-gray-300 bg-white">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.posts.map((post) => (
                <Card key={post.id} className="border border-gray-200 shadow-none bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#191919] leading-tight">{post.authorName}</span>
                        <span className="text-xs text-[#666666]">{post.followers} followers</span>
                        <div className="flex items-center gap-1 text-xs text-[#666666]">
                          <span>{post.time}</span>
                          <span>·</span>
                          <Globe className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#191919] line-clamp-3 mb-4">
                      {post.content}
                    </p>
                  </CardContent>
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={post.imageUrl} alt="Post content" fill className="object-cover" />
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Work Experience */}
          <Card className="border-none shadow-sm p-6 overflow-hidden">
            <h2 className="text-xl font-bold text-[#191919] mb-6">Work Experience</h2>
            <div className="space-y-8">
              {currentUser.experience.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="h-14 w-14 rounded-full flex-shrink-0"
                    style={{ backgroundColor: exp.logoColor }}
                  />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[#191919]">{exp.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#191919]">
                      <span>{exp.company}</span>
                      <span>·</span>
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                      <span>{exp.period}</span>
                      <span className="text-[#336644] font-semibold">{exp.duration}</span>
                    </div>
                    <p className="mt-3 text-[#666666] text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Skills Section */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-xl font-bold text-[#191919]">Skills</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {currentUser.skills.map((skill, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="text-md font-medium text-[#191919]">{skill}</p>
                </div>
              ))}
            </CardContent>
            <div className="border-t py-4 text-center">
              <button className="text-[#666666] hover:text-[#191919] font-semibold text-sm flex items-center justify-center gap-2 mx-auto">
                Show all skills <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Interests Section */}
          <Card className="border-none shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#191919] mb-2">Interests</h2>
            <button className="text-[#336644] text-sm font-semibold border-b-2 border-[#336644] pb-1 mb-6">
              Companies
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentUser.viewedPages.slice(0, 2).map((company) => (
                <div key={company.id} className="flex items-start gap-3">
                  <div className="h-12 w-12 flex-shrink-0">
                    <Image src={company.logo} alt={company.name} width={48} height={48} className="object-contain" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-sm text-[#191919]">{company.name}</h4>
                    <span className="text-xs text-[#666666]">{company.followers}</span>
                    <Button variant="outline" size="sm" className="mt-1 border-[#666666] text-[#666666] rounded-full h-8 flex items-center gap-1.5 px-4 font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      Tracking
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ad Banner */}
          <Card className="border-none shadow-sm overflow-hidden relative aspect-square group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Hiring ad"
              fill
              className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-start">
              <span className="text-white text-sm font-medium mb-1 drop-shadow-md">See Who is Hiring on</span>
              <h3 className="text-white text-4xl font-black drop-shadow-md">Jobs.com</h3>
            </div>
          </Card>

          {/* Pages People Also Viewed */}
          <Card className="border-none shadow-sm p-5">
            <h3 className="font-bold text-[#191919] mb-5">Pages people also viewed</h3>
            <div className="space-y-6">
              {currentUser.viewedPages.map((page) => (
                <div key={page.id} className="flex items-start gap-3">
                  <div className="h-12 w-12 p-1 border border-gray-100 flex-shrink-0 bg-white">
                    <Image src={page.logo} alt={page.name} width={48} height={48} className="object-contain" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="text-sm font-bold text-[#191919] leading-tight">{page.name}</h4>
                    <p className="text-xs text-[#666666] mt-0.5">{page.industry}</p>
                    <p className="text-xs text-[#666666]">{page.followers}</p>
                    <Button variant="outline" size="sm" className="mt-2 border-[#191919] text-[#191919] hover:bg-gray-50 rounded-full h-8 w-fit flex items-center gap-1.5 px-5 font-semibold">
                      <span className="text-lg leading-none">+</span> Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* People You May Know */}
          <Card className="border-none shadow-sm p-5">
            <h3 className="font-bold text-[#191919] mb-5">People you may know</h3>
            <div className="space-y-6">
              {currentUser.peopleKnown.map((person) => (
                <div key={person.id} className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 object-cover">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-[#191919]">{person.name}</h4>
                      <p className="text-xs text-[#666666]">{person.info}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 border-[#666666] text-[#666666] hover:bg-gray-50 rounded-full h-9 flex items-center justify-center gap-2 font-semibold">
                    <span className="text-lg leading-none">+</span> Connect
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations/Videos */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="p-5 space-y-6">
              {currentUser.recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-3 group cursor-pointer">
                  <div className="relative h-14 w-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    <Image src={rec.thumbnail} alt="Video" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-[#191919] line-clamp-2 leading-snug group-hover:text-[#336644] transition-colors">
                      {rec.title}
                    </h4>
                    <span className="text-[10px] text-[#666666] mt-1">{rec.views}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t py-4 text-center">
              <button className="text-[#336644] hover:underline font-bold text-[10px] uppercase tracking-wider mx-auto">
                SEE ALL RECOMENDATIONS
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
