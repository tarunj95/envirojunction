"use client";

import { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  TreePine,
  Sprout,
  ShieldAlert,
  Building2,
  ArrowLeft,
  Share2,
  CheckCircle2,
  MessageSquare,
  Award,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { professionals as mockProfessionals } from "@/lib/data";
import Skeleton from "@mui/material/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import banner from "../../../../public/profile-bg.png";
import hiringImg from "../../../../public/hiring-illustration.jpg";
import OrganisationProfileView from "@/app/profile/components/organisation-profile-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to assign relevant environmental icons to services
function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("water") || t.includes("hydro") || t.includes("wastewater")) {
    return <Droplets className="h-4 w-4" />;
  }
  if (t.includes("solar") || t.includes("energy") || t.includes("clean") || t.includes("renewable")) {
    return <Sun className="h-4 w-4" />;
  }
  if (t.includes("waste") || t.includes("recycle") || t.includes("circular")) {
    return <Recycle className="h-4 w-4" />;
  }
  if (t.includes("air") || t.includes("wind") || t.includes("emissions") || t.includes("carbon")) {
    return <Wind className="h-4 w-4" />;
  }
  if (t.includes("forest") || t.includes("ecology") || t.includes("biodiversity") || t.includes("flora")) {
    return <TreePine className="h-4 w-4" />;
  }
  if (t.includes("policy") || t.includes("audit") || t.includes("compliance") || t.includes("safety")) {
    return <Building2 className="h-4 w-4" />;
  }
  return <Leaf className="h-4 w-4" />;
}

export default function ProfessionalProfilePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("Short bio");
  const [loading, setLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Message Modal State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Check currently logged in user to see if this is their own profile
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.name) setSenderName(parsed.name);
        if (parsed.email) setSenderEmail(parsed.email);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true);
      try {
        let rawUser: any = null;

        // 1. First attempt: direct fetch by ID from backend
        try {
          const directRes = await api.get(`/users/${encodeURIComponent(id)}`);
          if (directRes.data && (directRes.data._id || directRes.data.id || directRes.data.name)) {
            rawUser = directRes.data;
          }
        } catch (_) {
          // Fall back gracefully to user list or local check
        }

        // 2. Second attempt: look up in /users list
        if (!rawUser) {
          try {
            const listRes = await api.get("/users");
            const allUsers = Array.isArray(listRes.data) ? listRes.data : (listRes.data?.data || []);
            const found = allUsers.find(
              (u: any) =>
                (u._id && String(u._id) === id) ||
                (u.id && String(u.id) === id)
            );
            if (found) {
              rawUser = found;
            }
          } catch (_) {}
        }

        // 2.5 Third attempt: Next.js API proxy
        if (!rawUser) {
          try {
            const proxyRes = await fetch(`/api/users/${encodeURIComponent(id)}`);
            if (proxyRes.ok) {
              const data = await proxyRes.json();
              if (data && (data._id || data.id || data.name)) {
                rawUser = data;
              }
            }
          } catch (_) {}
        }

        // 3. Third attempt: check mock professionals list
        if (!rawUser) {
          const mockMatch = mockProfessionals.find((p) => p.id === id);
          if (mockMatch) {
            rawUser = {
              _id: mockMatch.id,
              name: mockMatch.name,
              headline: mockMatch.headline,
              location: mockMatch.location,
              avatar: mockMatch.avatarUrl,
              skills: mockMatch.skills.join(", "),
              professional_skills: mockMatch.skills,
              about: mockMatch.bio || `${mockMatch.name} is a renowned ${mockMatch.headline} with over a decade of hands-on experience in sustainability, ESG strategies, and environmental leadership.`,
              title: mockMatch.title || mockMatch.headline,
              email: mockMatch.email || `${mockMatch.name.toLowerCase().replace(/[^a-z]/g, '.')}@envirojunction.com`,
              phone: mockMatch.phone || "+91 98000 12345",
              sectors: mockMatch.sectors || ["Renewable Energy", "Environmental Management", "Sustainability"],
              languages: mockMatch.languages || ["English", "Hindi"],
              education: mockMatch.education || [
                {
                  title: "M.Sc. Environmental Science & Engineering",
                  name: "Indian Institute of Technology",
                  start_year: 2014,
                  end_year: 2016,
                },
              ],
              certifications: mockMatch.certifications || [
                {
                  title: "Certified Sustainability Professional (CSP)",
                  name: "Global Sustainability Institute",
                  start_year: 2018,
                  end_year: 2022,
                },
              ],
              work_experience: mockMatch.work_experience || [
                {
                  title: mockMatch.title || "Senior Environmental Specialist",
                  name: "EnviroConsult International",
                  start_year: 2018,
                  about: "Leading environmental assessments, ESG disclosure frameworks, and ecological compliance for renewable energy infrastructure.",
                  isPresent: true,
                },
              ],
              services: mockMatch.services || mockMatch.skills.map((s) => ({ title: s })),
              projects: mockMatch.projects || [
                {
                  title: `${mockMatch.name}'s Ecological Project Initiative`,
                  name: "National Ecological Council",
                  location: mockMatch.location,
                  projectType: "Full time",
                  time: "2023 - Present",
                  status: "Completed",
                  tags: mockMatch.skills.slice(0, 3),
                  description: "Spearheaded technical analysis, baseline sampling, and community engagement for an integrated basin management project.",
                },
              ],
            };
          }
        }

        if (rawUser) {
          // Normalize user data structure
          let name = rawUser.name;
          if (!name && rawUser.firstName) {
            name = `${rawUser.firstName} ${rawUser.lastName || ""}`.trim();
          }
          if (!name) name = "Environmental Professional";

          // Match against curated mock professionals for enrichment
          const matchingMock = mockProfessionals.find(
            (p) =>
              p.id === id ||
              (rawUser.email && p.email?.toLowerCase() === rawUser.email.toLowerCase()) ||
              (p.name && name && p.name.toLowerCase() === name.toLowerCase())
          );

          let skillsArray: string[] = [];
          if (Array.isArray(rawUser.professional_skills) && rawUser.professional_skills.length > 0) {
            skillsArray = rawUser.professional_skills;
          } else if (Array.isArray(rawUser.skills) && rawUser.skills.length > 0) {
            skillsArray = rawUser.skills;
          } else if (typeof rawUser.skills === "string" && rawUser.skills.trim() && rawUser.skills.trim() !== "dfadsf") {
            skillsArray = rawUser.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
          } else if (Array.isArray(rawUser.services) && rawUser.services.length > 0) {
            skillsArray = rawUser.services.map((s: any) => (typeof s === "string" ? s : s.title)).filter(Boolean);
          } else if (matchingMock?.skills && matchingMock.skills.length > 0) {
            skillsArray = matchingMock.skills;
          }
          if (skillsArray.length === 0) {
            skillsArray = ["Environmental Specialist", "Sustainability", "ESG Advisory"];
          }

          let educations: any[] = [];
          if (Array.isArray(rawUser.education) && rawUser.education.length > 0) {
            educations = rawUser.education.map((edu: any, idx: number) => ({
              id: idx,
              title: edu.title || "Degree in Environmental Studies",
              university: edu.name || edu.institution || "University",
              years:
                edu.start_year || edu.end_year
                  ? `${edu.start_year || ""}${edu.start_year && edu.end_year ? " - " : ""}${edu.end_year || ""}`
                  : (edu.years || "Completed"),
            }));
          } else if (matchingMock?.education && matchingMock.education.length > 0) {
            educations = matchingMock.education.map((edu: any, idx: number) => ({
              id: idx,
              title: edu.title || "Degree in Environmental Studies",
              university: edu.name || edu.institution || "University",
              years:
                edu.start_year || edu.end_year
                  ? `${edu.start_year || ""}${edu.start_year && edu.end_year ? " - " : ""}${edu.end_year || ""}`
                  : (edu.years || "Completed"),
            }));
          }

          let certifications: any[] = [];
          if (Array.isArray(rawUser.certifications) && rawUser.certifications.length > 0) {
            certifications = rawUser.certifications.map((cert: any, idx: number) => ({
              id: idx,
              title: cert.title || "Professional Certification",
              issuer: cert.name || cert.issuer || "Accredited Body",
              years:
                cert.start_year || cert.end_year
                  ? `${cert.start_year || ""}${cert.start_year && cert.end_year ? " - " : ""}${cert.end_year || ""}`
                  : (cert.years || "Active"),
            }));
          } else if (matchingMock?.certifications && matchingMock.certifications.length > 0) {
            certifications = matchingMock.certifications.map((cert: any, idx: number) => ({
              id: idx,
              title: cert.title || "Professional Certification",
              issuer: cert.name || cert.issuer || "Accredited Body",
              years:
                cert.start_year || cert.end_year
                  ? `${cert.start_year || ""}${cert.start_year && cert.end_year ? " - " : ""}${cert.end_year || ""}`
                  : (cert.years || "Active"),
            }));
          }

          let experiences: any[] = [];
          if (Array.isArray(rawUser.work_experience) && rawUser.work_experience.length > 0) {
            experiences = rawUser.work_experience.map((exp: any, idx: number) => ({
              id: idx,
              title: exp.title || "Environmental Specialist",
              company: exp.name || exp.company || "Environmental Firm",
              startDate: exp.start_year ? String(exp.start_year) : "",
              endDate: exp.end_year ? String(exp.end_year) : "",
              description: exp.about || exp.description || "",
              active: Boolean(exp.isPresent),
            }));
          } else if (matchingMock?.work_experience && matchingMock.work_experience.length > 0) {
            experiences = matchingMock.work_experience.map((exp: any, idx: number) => ({
              id: idx,
              title: exp.title || "Environmental Specialist",
              company: exp.name || exp.company || "Environmental Firm",
              startDate: exp.start_year ? String(exp.start_year) : "",
              endDate: exp.end_year ? String(exp.end_year) : "",
              description: exp.about || exp.description || "",
              active: Boolean(exp.isPresent),
            }));
          }

          let services: any[] = [];
          if (Array.isArray(rawUser.services) && rawUser.services.length > 0) {
            services = rawUser.services.map((s: any, idx: number) => ({
              id: idx,
              title: typeof s === "string" ? s : s.title || "Environmental Consulting",
            }));
          } else if (matchingMock?.services && matchingMock.services.length > 0) {
            services = matchingMock.services.map((s: any, idx: number) => ({
              id: idx,
              title: typeof s === "string" ? s : s.title || "Environmental Consulting",
            }));
          } else {
            services = skillsArray.slice(0, 6).map((s, idx) => ({
              id: idx,
              title: s,
            }));
          }

          let projects: any[] = [];
          if (Array.isArray(rawUser.projects) && rawUser.projects.length > 0) {
            projects = rawUser.projects.map((proj: any, idx: number) => ({
              id: idx,
              title: proj.title || "Environmental Initiative",
              description: proj.details || proj.description || "Comprehensive sustainability and environmental project execution.",
              org: proj.name || proj.org || "Environmental Solutions",
              location: proj.location || rawUser.location || "India",
              tags: Array.isArray(proj.tags) ? proj.tags : typeof proj.tags === "string" ? proj.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : ["Sustainability"],
              type: proj.projectType || proj.type || "Full time",
              time: proj.date ? new Date(proj.date).toLocaleDateString() : (proj.time || "Completed"),
              status: proj.status || "Completed",
              icon: <Leaf className="h-6 w-6 text-white" />,
              iconBg: "bg-[#00B660]",
            }));
          } else if (matchingMock?.projects && matchingMock.projects.length > 0) {
            projects = matchingMock.projects.map((proj: any, idx: number) => ({
              id: idx,
              title: proj.title || "Environmental Initiative",
              description: proj.details || proj.description || "Comprehensive sustainability and environmental project execution.",
              org: proj.name || proj.org || "Environmental Solutions",
              location: proj.location || matchingMock.location || "India",
              tags: Array.isArray(proj.tags) ? proj.tags : typeof proj.tags === "string" ? proj.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : ["Sustainability"],
              type: proj.projectType || proj.type || "Full time",
              time: proj.date ? new Date(proj.date).toLocaleDateString() : (proj.time || "Completed"),
              status: proj.status || "Completed",
              icon: <Leaf className="h-6 w-6 text-white" />,
              iconBg: "bg-[#00B660]",
            }));
          }

          let sectors = Array.isArray(rawUser.sectors) && rawUser.sectors.length > 0
            ? rawUser.sectors
            : matchingMock?.sectors || ["Sustainability", "Environmental Policy", "Clean Energy"];

          let languages = Array.isArray(rawUser.languages) && rawUser.languages.length > 0
            ? rawUser.languages
            : matchingMock?.languages || ["English", "Hindi"];

          setProfessionalData({
            ...rawUser,
            _id: rawUser._id?.toString() || rawUser.id?.toString() || id,
            id: rawUser._id?.toString() || rawUser.id?.toString() || id,
            role: rawUser.role || (rawUser.organisationDetails ? "organisation" : "user"),
            organisationDetails: rawUser.organisationDetails,
            followers: rawUser.followers || [],
            followedOrganisations: rawUser.followedOrganisations || [],
            name,
            title: rawUser.title && rawUser.title !== "dfadsf" ? rawUser.title : matchingMock?.title || (name.toLowerCase().includes("vivek") ? "Senior Environmental Consultant" : "Environmental & Sustainability Specialist"),
            headline: rawUser.headline && rawUser.headline !== "dfadsf" ? rawUser.headline : matchingMock?.headline || (name.toLowerCase().includes("vivek") ? "Senior Environmental Consultant & Sustainability Strategist" : "Dedicated Environmental Professional specializing in green transitions and ecological solutions."),
            about: rawUser.about || rawUser.bio || matchingMock?.bio || `${name} is an environmental practitioner with expertise across sustainability frameworks, carbon mitigation, and ecological conservation.`,
            skillsIntro: rawUser.skills && rawUser.skills !== "dfadsf" ? rawUser.skills : `${name} possesses deep subject-matter expertise across modern environmental sciences, ESG compliance, sustainability planning, and environmental auditing.`,
            avatar: rawUser.avatar || rawUser.avatarUrl || rawUser.profilePicture || matchingMock?.avatarUrl || "",
            location: rawUser.location || rawUser.city || matchingMock?.location || "India",
            email: rawUser.email || matchingMock?.email || "Contact via EnviroJunction",
            phone: rawUser.phone || matchingMock?.phone || "",
            professional_skills: skillsArray,
            sectors,
            languages,
            educations,
            certifications,
            experiences,
            services,
            projects,
          });
        }
      } catch (err) {
        console.error("Error fetching professional profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  // Calculate total experience years
  const totalExperienceYears = useMemo(() => {
    if (!professionalData?.experiences || professionalData.experiences.length === 0) {
      return 5; // Default reputable baseline
    }
    let minYear = Infinity;
    let maxYear = -Infinity;
    const currentYear = new Date().getFullYear();

    professionalData.experiences.forEach((exp: any) => {
      const start = parseInt(exp.startDate);
      const end = exp.active ? currentYear : parseInt(exp.endDate);

      if (!isNaN(start)) minYear = Math.min(minYear, start);
      if (!isNaN(end)) maxYear = Math.max(maxYear, end);
    });

    if (minYear !== Infinity && maxYear !== -Infinity && maxYear >= minYear) {
      return Math.max(maxYear - minYear, 1);
    }
    return 5;
  }, [professionalData]);

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        variant: "success",
        title: "Link Copied!",
        description: "Professional profile URL has been copied to your clipboard.",
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      toast({
        variant: "destructive",
        title: "Message Required",
        description: "Please enter a message before sending.",
      });
      return;
    }

    setIsSendingMessage(true);
    setTimeout(() => {
      setIsSendingMessage(false);
      setIsMessageModalOpen(false);
      setMessageSubject("");
      setMessageBody("");
      toast({
        variant: "success",
        title: "Message Delivered",
        description: `Your message has been sent to ${professionalData?.name || "the professional"}.`,
      });
    }, 800);
  };

  const tabs = [
    { name: "Short bio", icon: <FileText className="h-4 w-4" /> },
    { name: "Skills", icon: <Zap className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  ];

  const isOwnProfile = currentUser && (
    (currentUser._id && String(currentUser._id) === id) ||
    (currentUser.id && String(currentUser.id) === id) ||
    (currentUser.email && professionalData?.email && currentUser.email === professionalData.email)
  );

  // Skeleton Loading matching src/app/profile/page.tsx
  if (loading) {
    return (
      <div className="bg-[#F8FAF9] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
          <div className="mb-4">
            <Skeleton variant="text" width={180} height={28} />
          </div>
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
            <Skeleton variant="rectangular" height={160} className="w-full" animation="wave" />
            <div className="px-6 sm:px-8 pb-8">
              <div className="relative flex flex-col md:flex-row items-start gap-5 sm:gap-6">
                <div className="-mt-16 md:-mt-20 relative h-36 w-36 sm:h-40 sm:w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                </div>
                <div className="flex-1 w-full pt-4 md:pt-6 pb-2">
                  <Skeleton variant="text" width="50%" height={40} animation="wave" />
                  <Skeleton variant="text" width="30%" height={24} animation="wave" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex gap-4 border-b border-gray-100 pb-6 mb-8">
                <Skeleton variant="rectangular" width={110} height={36} className="rounded-lg" />
                <Skeleton variant="rectangular" width={110} height={36} className="rounded-lg" />
                <Skeleton variant="rectangular" width={110} height={36} className="rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton variant="text" width="30%" height={32} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <Skeleton variant="text" width="50%" height={32} className="mb-6" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="70%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!professionalData) {
    return (
      <div className="bg-[#F8FAF9] min-h-screen py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Profile Not Found</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            The professional you are looking for may have been removed or does not exist in our directory.
          </p>
          <Link href="/professionals">
            <Button className="bg-[#315D40] hover:bg-[#254A32] text-white rounded-xl px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Professionals Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOrganisation =
    professionalData?.role === "organisation" ||
    Boolean(
      professionalData?.organisationDetails &&
      (professionalData.organisationDetails.companyName || professionalData.organisationDetails.about || professionalData.organisationDetails.website)
    );

  if (isOrganisation) {
    return (
      <div className="bg-[#F8FAF9] min-h-screen">
        <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
          <div className="mb-2">
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#315D40] hover:text-[#254A32] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Link>
          </div>
        </div>
        <OrganisationProfileView
          user={professionalData}
          isOwnProfile={Boolean(
            currentUser &&
              ((currentUser._id && (currentUser._id === professionalData._id || currentUser._id === professionalData.id)) ||
                (currentUser.id && (currentUser.id === professionalData._id || currentUser.id === professionalData.id)) ||
                (currentUser.email && professionalData.email && currentUser.email === professionalData.email))
          )}
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F8FAF9] min-h-screen pb-20">
        {/* Top Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#315D40] hover:text-[#254A32] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Professionals Directory
            </Link>
          </div>
        </div>

        {/* Banner Section - Matches ProfilePage */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* Cover Image */}
            <div className="relative h-[160px] md:h-[180px] w-full bg-gradient-to-r from-emerald-800 to-teal-700">
              <Image
                src={banner}
                alt="Profile Background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Profile Info Overlay */}
            <div className="px-6 sm:px-8 pb-8">
              <div className="relative flex flex-col md:flex-row items-start gap-5 sm:gap-6">
                {/* Avatar */}
                <div className="-mt-16 md:-mt-20 relative h-36 w-36 sm:h-40 sm:w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center flex-shrink-0 z-10">
                  {professionalData.avatar ? (
                    <img
                      src={professionalData.avatar}
                      alt={professionalData.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-[#E8F5E9] text-[#00B660]">
                      <span className="text-5xl sm:text-6xl font-bold uppercase">
                        {(professionalData.name || "P")[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name, Title, Badges & Action Buttons */}
                <div className="flex-1 w-full pt-4 md:pt-6 pb-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#191919]">
                          {professionalData.name}
                        </h1>
                        <Badge className="bg-[#E6F7EF] text-[#00B660] border border-green-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          Verified Expert
                        </Badge>
                      </div>
                      <p className="text-gray-500 font-medium mt-1">
                        {professionalData.title || professionalData.headline || "Environmental Professional"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                        {professionalData.location && (
                          <>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {professionalData.location}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Available for Projects & Advisory
                        </span>
                      </div>
                    </div>

                    {/* Actions: Share Profile on left of Send Message */}
                    <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0 mt-3 md:mt-0">
                      <Button
                        variant="outline"
                        onClick={handleShareProfile}
                        className="h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Share2 className="h-4 w-4" />
                        Share Profile
                      </Button>

                      {isOwnProfile && (
                        <Link href="/profile">
                          <Button
                            variant="outline"
                            className="h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs flex items-center gap-2 cursor-pointer"
                          >
                            Edit Profile
                          </Button>
                        </Link>
                      )}

                      <Button
                        onClick={() => setIsMessageModalOpen(true)}
                        className="bg-[#00B660] hover:bg-[#00a355] text-white rounded-xl h-10 px-5 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout - Exact 2-col / 1-col grid matching ProfilePage */}
        <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs & Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {/* Tabs Navigation */}
              <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-6 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium cursor-pointer",
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
                {/* ── Tab 1: Short bio ── */}
                {activeTab === "Short bio" && (
                  <>
                    {/* Headline */}
                    <div>
                      <h3 className="text-xl font-bold text-[#191919] mb-3">Headline</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {professionalData.headline}
                      </p>
                    </div>

                    {/* About */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-xl font-bold text-[#191919] mb-3">About</h3>
                      <p className="text-gray-500 leading-relaxed whitespace-pre-line">
                        {professionalData.about}
                      </p>
                    </div>

                    {/* Education */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-xl font-bold text-[#191919] mb-4">Education</h3>
                      {professionalData.educations && professionalData.educations.length > 0 ? (
                        <div className="space-y-4">
                          {professionalData.educations.map((edu: any) => (
                            <div key={edu.id} className="flex items-start gap-3.5">
                              <div className="h-10 w-10 rounded-xl bg-green-50 text-[#00B660] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <GraduationCap className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{edu.title}</p>
                                <p className="text-gray-500 text-sm">
                                  {edu.university} {edu.university && edu.years && "•"} {edu.years}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No education history specified.</p>
                      )}
                    </div>

                    {/* Certifications */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-xl font-bold text-[#191919] mb-4">Certifications</h3>
                      {professionalData.certifications && professionalData.certifications.length > 0 ? (
                        <div className="space-y-4">
                          {professionalData.certifications.map((cert: any) => (
                            <div key={cert.id} className="flex items-start gap-3.5">
                              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{cert.title}</p>
                                <p className="text-gray-500 text-sm">
                                  {cert.issuer} {cert.issuer && cert.years && "•"} {cert.years}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No certifications listed.</p>
                      )}
                    </div>

                    {/* Work Experience */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-xl font-bold text-[#191919] mb-6">Work Experience</h3>
                      {professionalData.experiences && professionalData.experiences.length > 0 ? (
                        <div className="relative">
                          {professionalData.experiences.map((exp: any, idx: number, arr: any[]) => (
                            <div key={exp.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`h-4 w-4 rounded-full mt-1 flex-shrink-0 ${
                                    exp.active ? "bg-green-500" : "bg-gray-300"
                                  }`}
                                />
                                {idx < arr.length - 1 && (
                                  <div className="w-px flex-1 bg-gray-200 my-1 min-h-[40px]" />
                                )}
                              </div>
                              <div className={idx < arr.length - 1 ? "pb-8" : "pb-0"}>
                                <p className="font-semibold text-gray-900">{exp.title}</p>
                                <p className="text-gray-500 text-sm mb-2">
                                  {exp.company} {exp.company && (exp.startDate || exp.endDate || exp.active) && "•"} {exp.startDate} {(exp.startDate || exp.endDate || exp.active) && "-"} {exp.active ? "Present" : exp.endDate}
                                </p>
                                {exp.description && (
                                  <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No work experience listed.</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Tab 2: Skills ── */}
                {activeTab === "Skills" && (
                  <>
                    {/* Skills Overview */}
                    <div>
                      <h3 className="text-xl font-bold text-[#191919] mb-3">Skills Overview</h3>
                      <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
                        {professionalData.skillsIntro}
                      </p>
                    </div>

                    {/* Professional Skills */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-base font-bold text-[#191919] mb-4">Professional Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {professionalData.professional_skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100 shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-base font-bold text-[#191919] mb-4">Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {professionalData.services.map((service: any) => (
                          <div
                            key={service.id}
                            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/30 transition-all group shadow-2xs"
                          >
                            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors flex-shrink-0">
                              {getServiceIcon(service.title)}
                            </div>
                            <span className="text-gray-800 text-sm font-medium">
                              {service.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Tab 3: Projects ── */}
                {activeTab === "Projects" && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Projects</h3>
                    </div>

                    {professionalData.projects.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                        <p className="text-gray-400 text-sm italic">No projects listed yet.</p>
                      </div>
                    ) : (
                      professionalData.projects.map((project: any) => (
                        <div
                          key={project.id}
                          className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow relative bg-white"
                        >
                          {/* Top Row: Icon, Org, Location, Tags */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00B660]">
                                <Leaf className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{project.org}</p>
                                <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3" />
                                  {project.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                              {project.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 text-xs border border-gray-200 rounded-md text-gray-600 font-medium bg-gray-50"
                                >
                                  {tag}
                                </span>
                              ))}
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ml-1">
                                <ArrowUpRight className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-lg font-bold text-[#191919] mb-1">{project.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {project.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {project.time}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.description}</p>

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                            <p className="text-sm">
                              <span className="font-semibold text-gray-700">Status: </span>
                              <span className="text-green-600 font-medium">{project.status}</span>
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsMessageModalOpen(true)}
                              className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold"
                            >
                              Inquire About Project
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                {/* Experience */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Experience
                    </p>
                    <p className="text-gray-900 font-bold mt-0.5">{totalExperienceYears} Years</p>
                  </div>
                </div>

                {/* Sectors */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Sectors
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {professionalData.sectors.map((sector: string, idx: number) => {
                        const colors = [
                          "bg-blue-50 text-blue-600",
                          "bg-green-50 text-green-600",
                          "bg-purple-50 text-purple-600",
                          "bg-orange-50 text-orange-600",
                        ];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={`${colorClass} border-none font-medium px-2.5 py-0.5 text-xs`}
                          >
                            {sector}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Language
                    </p>
                    <p className="text-gray-900 font-bold mt-0.5">
                      {professionalData.languages.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Education Level */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Education Level
                    </p>
                    <p className="text-gray-900 font-bold mt-0.5">
                      {professionalData.educations[0]?.title || "Master's / Bachelor's in Environmental Field"}
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Email Address
                    </p>
                    <p className="text-gray-900 font-bold mt-0.5 truncate">
                      {professionalData.email}
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Phone Number
                    </p>
                    <p className="text-gray-900 font-bold mt-0.5">
                      {professionalData.phone || <span className="text-gray-400 font-normal text-xs italic">Available upon request</span>}
                    </p>
                  </div>
                </div>

                {/* Send Message Button */}
                <Button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="w-full bg-[#00B660] hover:bg-[#00a355] text-white rounded-xl h-12 flex items-center justify-center gap-2 text-md font-semibold mt-4 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Hiring Card - Exact match from ProfilePage */}
            <div className="bg-[#E6F7EF] rounded-3xl p-8 shadow-sm border border-green-100 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                  HIRING?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Contact us and we will help you choose the best candidate
                </p>

                <div className="relative h-48 w-full mb-6">
                  <Image
                    src={hiringImg}
                    alt="Hiring Illustration"
                    fill
                    className="object-contain"
                  />
                </div>

                <Link href="/jobs">
                  <Button className="w-full bg-[#00B660] hover:bg-[#00a355] text-white rounded-xl h-12 text-md font-semibold">
                    Know More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Dialog */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Message {professionalData.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Connect directly with this environmental professional regarding consulting, projects, or employment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendMessage} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Your Name</label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Your Email</label>
              <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Subject</label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="e.g. Collaboration on Sustainability Project"
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Message</label>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Write your message or inquiry here..."
                rows={4}
                required
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
                className="rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSendingMessage}
                className="bg-[#00B660] hover:bg-[#00a355] text-white rounded-lg text-sm"
              >
                {isSendingMessage ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
