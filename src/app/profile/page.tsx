"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  Calendar,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  Send,
  User,
  GraduationCap as EducationIcon,
  Briefcase as WorkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import banner from "../../../public/profile-bg.png"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { name: "Profile", icon: <User className="h-4 w-4" /> },
    { name: "Work Skills", icon: <WorkIcon className="h-4 w-4" /> },
    { name: "Education", icon: <EducationIcon className="h-4 w-4" /> },
    { name: "Work Experience", icon: <Briefcase className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-[#F8FAF9] min-h-screen pb-20">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative h-[350px] w-full">
            <Image
              src={banner}
              alt="Profile Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Profile Info Overlay */}
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-20">
              <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <Image
                  src="/profile-avatar.png"
                  alt="Niharika Singh"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-[#191919]">Niharika Singh</h1>
                <p className="text-gray-500 font-medium mt-1">
                  UI/UX Expert , Front End , Environment Activist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Tabs & About */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-6 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                    activeTab === tab.name
                      ? "border-green-600 text-green-600 bg-green-50"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#191919] mb-4">Headline</h3>
                <p className="text-gray-600 leading-relaxed">
                  Environmental management expert having 20+ years of experience in the waste management industry with exposure in the indian region.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#191919] mb-4">About</h3>
                <p className="text-gray-500 leading-relaxed">
                  Hey there! Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Overview Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#191919] mb-6">Overview</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Experience</p>
                  <p className="text-gray-900 font-bold">12 Years</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Sectors</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-medium px-3">IT</Badge>
                    <Badge variant="secondary" className="bg-green-50 text-green-600 border-none font-medium px-3">Agriculture</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Language</p>
                  <p className="text-gray-900 font-bold">English, Hindi, Spanish</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Education Level</p>
                  <p className="text-gray-900 font-bold">Master Degree</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-gray-900 font-bold blur-[4px]">tejinder@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Phone Number</p>
                  <p className="text-gray-900 font-bold blur-[4px]">21239480202</p>
                </div>
              </div>

              <Button className="w-full bg-[#00B660] hover:bg-[#00a355] text-white rounded-xl h-12 flex items-center gap-2 text-md font-semibold mt-4">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Hiring Card */}
          <div className="bg-[#E6F7EF] rounded-3xl p-8 shadow-sm border border-green-100 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">HIRING?</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Contact us and we will help you choose the best candidate
              </p>

              <div className="relative h-48 w-full mb-6">
                <Image
                  src="/hiring-illustration.png"
                  alt="Hiring Illustration"
                  fill
                  className="object-contain"
                />
              </div>

              <Button className="w-full bg-[#00B660] hover:bg-[#00a355] text-white rounded-xl h-12 text-md font-semibold">
                Know More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
