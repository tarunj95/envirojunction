"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jobs } from "@/lib/data";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Award,
  Globe,
  Phone,
  Mail,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
  CheckCircle2,
  Lock,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  // Find current job
  const job = jobs.find((j) => j.id === id);

  // If job is not found, display a friendly message
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find the job posting you're looking for. It may have been removed or expired.
        </p>
        <Link href="/jobs">
          <Button className="bg-[#315D40] hover:bg-[#254A32] text-white">
            Back to Job Directory
          </Button>
        </Link>
      </div>
    );
  }

  // Generate dynamic fields to match mockup
  const website = `https://${job.company.toLowerCase().replace(/\s+/g, "")}.com`;
  const phone = "(406) 555-0120";
  const email = `career@${job.company.toLowerCase().replace(/\s+/g, "")}.com`;
  
  // Calculate dynamic expire date (30 days from posted date)
  const posted = new Date(job.postedDate);
  const expireDate = new Date(posted.getTime() + 30 * 24 * 60 * 60 * 1000);
  const formattedExpire = expireDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const formattedPosted = posted.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const salary = job.type === "Full-Time" ? "$50k-80k/month" : "$10k-15k/month";
  const experience = "10-15 Years";
  const education = "Graduation";

  // Detailed Description Template
  const descriptionText = `${job.description || "Looking for a talented team member."} Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.

Nam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.`;

  // Responsibilities Template
  const responsibilities = [
    "Quisque semper gravida est ac consectetur.",
    "Curabitur blandit lorem velit, vitae pretium leo placerat eget.",
    "Morbi mattis in ipsum ac tempus.",
    "Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.",
    "vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.",
    "lobortis vel lectus. Nulla at risus ut diam.",
    "commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.",
    "odio metus posuere lorem, id condimentum erat velit nec neque.",
    "dui sodales ut. Curabitur tempus augue."
  ];

  // Related jobs search
  const allRelated = jobs.filter(j => j.id !== job.id);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const displayedRelated = allRelated.slice(relatedIndex, relatedIndex + 3);

  const nextRelated = () => {
    if (relatedIndex + 3 < allRelated.length) {
      setRelatedIndex(prev => prev + 3);
    }
  };

  const prevRelated = () => {
    if (relatedIndex > 0) {
      setRelatedIndex(prev => prev - 3);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumbs */}
      <div className="bg-white border border-gray-200/60 rounded-xl p-4 flex justify-between items-center shadow-sm">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
          <span>Job Details</span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50 border-gray-200 text-gray-700 font-medium">
              <span>More Action</span>
              <ChevronRight className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 rounded-xl shadow-md p-1">
            <DropdownMenuItem className="cursor-pointer font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg py-2 px-3">
              Share Job
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg py-2 px-3">
              Report Abuse
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg py-2 px-3">
              Print Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Job Info Card */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        {/* Left: Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Logo container */}
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md relative overflow-hidden">
            {job.logoUrl ? (
              <Image 
                src={job.logoUrl} 
                alt={job.company} 
                fill 
                className="object-contain p-2" 
                onError={(e) => {
                  // Fallback to letters
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-2xl font-bold uppercase">{job.company.substring(0, 2)}</span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{job.title}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-500 border border-rose-100">
                  Featured
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                  {job.type}
                </span>
              </div>
            </div>

            {/* Links row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <Globe className="h-4 w-4 text-gray-400" />
                <span>{website}</span>
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{phone}</span>
              </span>
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col items-start md:items-end justify-center gap-2 flex-shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="p-3 bg-[#EAF3FA] hover:bg-[#D4E8F5] text-[#3182CE] border-0 h-11 w-11 rounded-xl transition-all shadow-none">
              <Bookmark className="h-5 w-5 fill-[#3182CE]" />
            </Button>
            <Button className="bg-[#315D40] hover:bg-[#254A32] text-white flex-1 md:flex-none px-6 py-2.5 h-11 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
              <span>Apply Now</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Job expire in: <span className="text-[#E05151] font-semibold">{formattedExpire}</span>
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Job Description & Responsibilities */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
          
          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Job Description</h2>
            <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">
              {descriptionText}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Responsibilities</h2>
            <ul className="list-disc list-outside pl-5 space-y-3 text-gray-600 text-[15px]">
              {responsibilities.map((resp, index) => (
                <li key={index} className="pl-1">
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          {/* Share job */}
          <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Share this job:</span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all font-medium">
                <Facebook className="h-4 w-4 text-[#1877F2] fill-[#1877F2]" />
                <span>Facebook</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all font-medium">
                <Twitter className="h-4 w-4 text-[#1DA1F2] fill-[#1DA1F2]" />
                <span>Twitter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all font-medium">
                {/* Custom Pinterest P Icon */}
                <svg className="h-4 w-4 text-[#BD081C] fill-[#BD081C]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.17-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.99-.28 1.18.59 2.15 1.76 2.15 2.11 0 3.73-2.23 3.73-5.44 0-2.85-2.05-4.83-4.96-4.83-3.38 0-5.36 2.54-5.36 5.15 0 1.02.39 2.12.88 2.72.1.12.11.23.08.35-.09.37-.29 1.19-.33 1.36-.05.21-.17.26-.4.15-1.5-.7-2.44-2.9-2.44-4.66 0-3.8 2.76-7.29 7.96-7.29 4.18 0 7.42 2.98 7.42 6.96 0 4.15-2.62 7.49-6.26 7.49-1.22 0-2.37-.63-2.76-1.38 0 0-.6 2.3-.75 2.87-.27 1.05-1.01 2.37-1.5 3.17C8.91 23.82 10.4 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                </svg>
                <span>Pinterest</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Overview & Company Details */}
        <div className="space-y-6">
          
          {/* Job Overview Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Job Overview</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-y-5 gap-x-4">
              
              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Job Posted</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{formattedPosted}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <Calendar className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Job Expire In</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{formattedExpire}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Education</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{education}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Salary</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{salary}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Job Type</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{job.type}</p>
                </div>
              </div>

              <div className="flex items-start col-span-2">
                <div className="bg-emerald-50 text-[#315D40] p-2 rounded-xl mr-3 flex-shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Experience</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{experience}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Company Details Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Header: Logo & Subtitle */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{job.company}</h3>
                <p className="text-xs text-gray-400">Social networking service</p>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3.5 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Founded in:</span>
                <span className="font-medium text-gray-700">March 21, 2006</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Organization type:</span>
                <span className="font-medium text-gray-700">Private Company</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Company size:</span>
                <span className="font-medium text-gray-700">120-300 Employers</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Phone:</span>
                <span className="font-medium text-gray-700">{phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <span className="font-medium text-gray-700">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Website:</span>
                <a href={website} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700 hover:underline flex items-center gap-0.5">
                  <span>{website}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Social Icons row */}
            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <a href="#" className="h-9 w-9 bg-gray-50 hover:bg-[#1877F2]/10 hover:text-[#1877F2] text-gray-400 rounded-lg flex items-center justify-center transition-all">
                <Facebook className="h-4.5 w-4.5 fill-current" />
              </a>
              <a href="#" className="h-9 w-9 bg-[#315D40] text-white hover:bg-[#254A32] rounded-lg flex items-center justify-center transition-all shadow-sm">
                <Twitter className="h-4.5 w-4.5 fill-current" />
              </a>
              <a href="#" className="h-9 w-9 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="h-9 w-9 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                <Youtube className="h-4.5 w-4.5 fill-current" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Related Jobs Section */}
      <div className="space-y-6 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Related Jobs</h2>
          {allRelated.length > 3 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-lg border-gray-200"
                onClick={prevRelated}
                disabled={relatedIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-lg border-gray-200"
                onClick={nextRelated}
                disabled={relatedIndex + 3 >= allRelated.length}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedRelated.map((relJob) => (
            <Card key={relJob.id} className="transition-shadow duration-300 hover:shadow-lg border-gray-200/60 rounded-2xl overflow-hidden bg-white flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                
                {/* Top Row: Logo & Featured */}
                <div className="flex justify-between items-start">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#315D40] to-emerald-400 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {relJob.company.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-100">
                    Featured
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{relJob.location}</span>
                  </div>
                  <Link href={`/jobs/${relJob.id}`}>
                    <h3 className="font-semibold text-gray-950 text-base hover:text-emerald-700 transition-colors line-clamp-1">
                      {relJob.title}
                    </h3>
                  </Link>
                </div>

                {/* Footer details */}
                <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{relJob.type}</span>
                    <span>•</span>
                    <span>{relJob.type === "Full-Time" ? "$50k-80k/month" : "$10k-15k/month"}</span>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
