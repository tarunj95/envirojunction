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
  FileText,
  Zap,
  FolderKanban,
  MapPin,
  Clock,
  ArrowUpRight,
  Leaf,
  Recycle,
  Droplets,
  Wind,
  Sun,
  Trash2,
  ClipboardList,
  Lightbulb,
  Cloud,
  Building2,
  RefreshCw,
  ShieldAlert,
  TreePine,
  Sprout,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import banner from "../../../public/profile-bg.png"
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Short bio");
  const { user } = useUser();

  const tabs = [
    { name: "Short bio", icon: <FileText className="h-4 w-4" /> },
    { name: "Skills", icon: <Zap className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
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
              <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user?.name || "Profile"}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-[#191919]">{user?.name}</h1>
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

              {/* ── Short bio ── */}
              {activeTab === "Short bio" && (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-[#191919] mb-4">Headline</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Environmental management expert having 20+ years of experience in the waste management industry with exposure in the indian region.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-[#191919] mb-4">About</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Hey there! Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                  </div>

                  {/* Education */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-[#191919] mb-4">Education</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-900">Master of Design</p>
                        <p className="text-gray-500 text-sm">Stanford University • 2012 - 2014</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Bachelor of Graphic Design</p>
                        <p className="text-gray-500 text-sm">University of California • 2008 - 2012</p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-[#191919] mb-4">Certifications</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-900">Adobe Photoshop</p>
                        <p className="text-gray-500 text-sm">Adobe • 2012 - 2019</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Adobe Illustrations</p>
                        <p className="text-gray-500 text-sm">Adobe • 2008 - 2020</p>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-[#191919] mb-6">Work Experience</h3>
                    <div className="relative">
                      {[
                        {
                          title: "Senior Product Designer",
                          company: "Facebook Inc.",
                          period: "2019 - 2021",
                          description: "Created and maintained design systems. Conducted user research and usability testing to improve product experiences.",
                          active: true,
                        },
                        {
                          title: "UI/UX Designer",
                          company: "Google LLC",
                          period: "2016 - 2019",
                          description: "Designed user interfaces for web and mobile applications. Collaborated with development teams to ensure design implementation.",
                          active: false,
                        },
                        {
                          title: "Junior Designer",
                          company: "Microsoft Corp",
                          period: "2014 - 2016",
                          description: "Assisted senior designers in creating marketing materials and product designs.",
                          active: false,
                        },
                      ].map((exp, idx, arr) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`h-4 w-4 rounded-full mt-1 flex-shrink-0 ${exp.active ? "bg-green-500" : "bg-gray-300"}`} />
                            {idx < arr.length - 1 && (
                              <div className="w-px flex-1 bg-gray-200 my-1" />
                            )}
                          </div>
                          <div className={idx < arr.length - 1 ? "pb-8" : "pb-0"}>
                            <p className="font-semibold text-gray-900">{exp.title}</p>
                            <p className="text-gray-500 text-sm mb-2">{exp.company} • {exp.period}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Skills ── */}
              {activeTab === "Skills" && (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-[#191919] mb-4">Skills</h3>
                    <p className="text-gray-500 leading-relaxed mb-4">
                      Hello there! My name is Alan Walker. I am a graphic designer, and I&apos;m very passionate and dedicated to my work. With 20 years experience as a professional a graphic designer, I have acquired the skills and knowledge necessary to make your project a success.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis illum fuga eveniet. Deleniti asperiores, commodi quae ipsum quas est itaque, ipsa, dolore beatae voluptates nemo blanditiis iste eius officia minus. Id nisi, consequuntur sunt impedit quidem, vitae mollitia!
                    </p>
                  </div>

                  {/* Professional Skills */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-[#191919] mb-4">Professional Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Project Management",
                        "Copywriting",
                        "English",
                        "UI/UX Design",
                        "Figma",
                        "Adobe Photoshop",
                        "Graphic Design",
                        "Brand Strategy",
                        "User Research",
                        "Prototyping",
                        "Typography",
                        "Motion Design",
                        "Agile",
                        "Design Systems",
                        "Illustration",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Environment Services */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-[#191919] mb-4">Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { title: "Waste Management Consulting", icon: <Recycle className="h-4 w-4" /> },
                        { title: "Environmental Impact Assessment (EIA)", icon: <ClipboardList className="h-4 w-4" /> },
                        { title: "Sustainability Strategy Development", icon: <Lightbulb className="h-4 w-4" /> },
                        { title: "Solar Power System Design", icon: <Sun className="h-4 w-4" /> },
                        { title: "Wastewater Treatment Solutions", icon: <Droplets className="h-4 w-4" /> },
                        { title: "Carbon Auditing & Offsetting", icon: <Cloud className="h-4 w-4" /> },
                        { title: "Green Building Certification (LEED)", icon: <Building2 className="h-4 w-4" /> },
                        { title: "Circular Economy Implementation", icon: <RefreshCw className="h-4 w-4" /> },
                        { title: "Hazardous Material Management", icon: <ShieldAlert className="h-4 w-4" /> },
                        { title: "Biodiversity Conservation Planning", icon: <TreePine className="h-4 w-4" /> },
                        { title: "Renewable Energy Feasibility Studies", icon: <Zap className="h-4 w-4" /> },
                        { title: "Ambient Air Quality Monitoring", icon: <Wind className="h-4 w-4" /> },
                        { title: "Climate Change Adaptation Planning", icon: <Globe className="h-4 w-4" /> },
                        { title: "Ecological Restoration Services", icon: <Sprout className="h-4 w-4" /> },
                        { title: "ESG Reporting & Compliance", icon: <BarChart3 className="h-4 w-4" /> },
                      ].map((service) => (
                        <div
                          key={service.title}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/30 transition-all group"
                        >
                          <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                            {service.icon}
                          </div>
                          <span className="text-gray-700 text-sm font-medium">
                            {service.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Projects ── */}
              {activeTab === "Projects" && (
                <div className="space-y-4">
                  {[
                    {
                      icon: <Leaf className="h-6 w-6 text-white" />,
                      iconBg: "bg-green-500",
                      org: "EnviroJunction",
                      location: "New Delhi, IN",
                      tags: ["Sustainability", "GIS"],
                      title: "Smart Waste Collection Network",
                      type: "Full time",
                      time: "2 months ago",
                      description: "Designed and deployed an IoT-based waste bin monitoring system across 50+ urban zones, reducing collection costs by 35% through real-time route optimisation.",
                      status: "Done",
                    },
                    {
                      icon: <Recycle className="h-6 w-6 text-white" />,
                      iconBg: "bg-blue-500",
                      org: "GreenCycle Org",
                      location: "Mumbai, IN",
                      tags: ["Circular Economy", "Policy"],
                      title: "Plastic Waste Reduction Campaign",
                      type: "Contract",
                      time: "5 months ago",
                      description: "Led a city-wide initiative to divert 200+ tonnes of plastic waste annually through community recycling drives, corporate partnerships, and policy advocacy.",
                      status: "Done",
                    },
                    {
                      icon: <Droplets className="h-6 w-6 text-white" />,
                      iconBg: "bg-cyan-500",
                      org: "AquaEarth Foundation",
                      location: "Chennai, IN",
                      tags: ["Water Mgmt", "NGO"],
                      title: "Wastewater Treatment & Reuse System",
                      type: "Full time",
                      time: "8 months ago",
                      description: "Implemented a decentralised wastewater treatment plant serving 10,000 households, achieving 80% water reuse for agricultural purposes in drought-prone areas.",
                      status: "Done",
                    },
                    {
                      icon: <Wind className="h-6 w-6 text-white" />,
                      iconBg: "bg-purple-500",
                      org: "CleanAir Collective",
                      location: "Bengaluru, IN",
                      tags: ["Air Quality", "Analytics"],
                      title: "Industrial Emission Monitoring Dashboard",
                      type: "Part time",
                      time: "1 year ago",
                      description: "Built a real-time air quality analytics platform integrating 120+ sensors across industrial corridors, enabling regulatory compliance reporting and public transparency.",
                      status: "Done",
                    },
                    {
                      icon: <Sun className="h-6 w-6 text-white" />,
                      iconBg: "bg-orange-400",
                      org: "SolarSweep Ventures",
                      location: "Jaipur, IN",
                      tags: ["Renewable Energy", "Waste-to-Energy"],
                      title: "Solar-Powered Composting Facility",
                      type: "Contract",
                      time: "1.5 years ago",
                      description: "Developed an off-grid composting facility powered entirely by solar energy, converting 5 tonnes of organic municipal waste per day into fertiliser for local farms.",
                      status: "Done",
                    },
                  ].map((project, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${project.iconBg}`}>
                            {project.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{project.org}</p>
                            <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />{project.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {project.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs border border-gray-200 rounded-md text-gray-500 font-medium">{tag}</span>
                          ))}
                          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ml-1">
                            <ArrowUpRight className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-[#191919] mb-1">{project.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{project.type}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{project.time}</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-semibold text-gray-700">Status: </span>
                          <span className="text-green-600 font-medium">{project.status}</span>
                        </p>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                  <p className={cn("text-gray-900 font-bold", !user?.email && "blur-[4px]")}>{user?.email || "tejinder@gmail.com"}</p>
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
                  src="https://images.pexels.com/photos/34216444/pexels-photo-34216444.jpeg?_gl=1*1edr2hn*_ga*MTY5ODIyNjY4OS4xNzc0NTM3NzIx*_ga_8JE65Q40S6*czE3Nzc2MzA0NTQkbzIkZzEkdDE3Nzc2MzA0NjUkajQ5JGwwJGgw"
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
