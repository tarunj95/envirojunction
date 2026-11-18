"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  ShieldCheck,
  Users,
  MapPin,
  Building2,
  Calendar,
  Mail,
  Phone,
  Send,
  MoreHorizontal,
  Briefcase,
  FileText,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Share2,
  Search,
  ChevronDown,
  ExternalLink,
  Plus,
  ArrowRight,
  Check,
  Clock,
  Newspaper,
  Video,
  CheckCircle2,
  Pencil,
  X,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

interface OrganisationProfileViewProps {
  user?: any;
  isOwnProfile?: boolean;
  onUpdateUser?: (updated: any) => void;
}

export interface OrganisationProfileData {
  companyName: string;
  headline: string;
  about: string;
  website: string;
  linkedin: string;
  companySize: string;
  primaryUseCase: string;
  headquarters: string;
  organizationType: string;
  founded: string;
  phone: string;
  email: string;
  expertise: string[];
  gstNumber: string;
  cinNumber: string;
}

const COMPANY_SIZE_OPTIONS = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "501-1000 Employees",
  "1000+ Employees",
];

const ORG_TYPE_OPTIONS = [
  "Private Company",
  "Public Company",
  "Non-Profit Organization",
  "Government Agency / PSU",
  "Educational & Research Institute",
  "Partnership",
];

const PRESET_EXPERTISE = [
  "Renewable Energy",
  "ESG Consulting",
  "Clean Technology",
  "Sustainability Solutions",
  "Wildlife Protection & Management",
  "Reforestation & Afforestation",
  "Marine & Coastal Conservation",
  "Invasive Species Control",
  "Ecosystem Restoration",
  "Waste Management & Circular Economy",
  "Carbon Accounting & Offsets",
];

export default function OrganisationProfileView({
  user,
  isOwnProfile = true,
  onUpdateUser,
}: OrganisationProfileViewProps) {
  const { toast } = useToast();

  // Active top-level tab: "Profile" | "Posts" | "Jobs" | "Tenders"
  const [activeTab, setActiveTab] = useState<"Profile" | "Posts" | "Jobs" | "Tenders">("Profile");

  // Follow interaction state
  const orgId = user?._id || user?.id;
  const initialFollowers = Array.isArray(user?.followers) ? user.followers.length : 0;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(initialFollowers);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Posts tab filter
  const [postFilter, setPostFilter] = useState<"All" | "Videos" | "Jobs" | "Tenders" | "News">("All");

  // Post reactions state
  const [postLikes, setPostLikes] = useState<{ [key: string]: { count: number; active: boolean } }>({
    post1: { count: 248, active: false },
    post2: { count: 152, active: false },
  });

  // Jobs tab search & filter
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<"Open Jobs" | "Closed" | "Hired">("Open Jobs");
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);

  // Dynamic organisation profile state
  const orgDetails = user?.organisationDetails || {};
  const [profileData, setProfileData] = useState<OrganisationProfileData>({
    companyName: orgDetails.companyName || user?.name || "Green Core Solutions",
    headline: user?.headline || orgDetails.headline || "Driving Innovation, Advancing Sustainability, and Creating Lasting Impact for a Better Future.",
    about: orgDetails.about || user?.about ||
      "GreenCore Solutions is a forward-thinking organization committed to driving innovation, sustainability, and positive change. We combine technology, expertise, and collaboration to deliver solutions that address industry challenges and create lasting value.\n\nOur work focuses on building smarter, more sustainable solutions while empowering businesses, communities, and individuals to achieve their goals. Through continuous innovation and a commitment to excellence, we strive to create a better future for everyone.",
    website: orgDetails.website || "www.greencore.com",
    linkedin: orgDetails.linkedin || "",
    companySize: orgDetails.companySize || "51-200 Employees",
    primaryUseCase: orgDetails.primaryUseCase || "Hiring Candidates",
    headquarters: orgDetails.headquarters || "New Delhi, India",
    organizationType: orgDetails.organizationType || "Private Company",
    founded: orgDetails.founded || "2014",
    phone: orgDetails.phone || user?.phone || "+91 856568552",
    email: orgDetails.email || user?.email || "contact@greencore.com",
    expertise: Array.isArray(orgDetails.expertise) && orgDetails.expertise.length > 0
      ? (orgDetails.expertise as string[])
      : ["Renewable Energy", "ESG Consulting", "Clean Technology", "Sustainability Solutions"],
    gstNumber: orgDetails.gstNumber || "",
    cinNumber: orgDetails.cinNumber || "",
  });

  // Sync state whenever user prop updates from backend
  useEffect(() => {
    if (user) {
      const org = user.organisationDetails || {};
      setProfileData({
        companyName: org.companyName || user.name || "Green Core Solutions",
        headline: user.headline || org.headline || "Driving Innovation, Advancing Sustainability, and Creating Lasting Impact for a Better Future.",
        about: org.about || user.about ||
          "GreenCore Solutions is a forward-thinking organization committed to driving innovation, sustainability, and positive change. We combine technology, expertise, and collaboration to deliver solutions that address industry challenges and create lasting value.\n\nOur work focuses on building smarter, more sustainable solutions while empowering businesses, communities, and individuals to achieve their goals. Through continuous innovation and a commitment to excellence, we strive to create a better future for everyone.",
        website: org.website || "www.greencore.com",
        linkedin: org.linkedin || "",
        companySize: org.companySize || "51-200 Employees",
        primaryUseCase: org.primaryUseCase || "Hiring Candidates",
        headquarters: org.headquarters || "New Delhi, India",
        organizationType: org.organizationType || "Private Company",
        founded: org.founded || "2014",
        phone: org.phone || user.phone || "+91 856568552",
        email: org.email || user.email || "contact@greencore.com",
        expertise: org.expertise && org.expertise.length > 0
          ? org.expertise
          : ["Renewable Energy", "ESG Consulting", "Clean Technology", "Sustainability Solutions"],
        gstNumber: org.gstNumber || "",
        cinNumber: org.cinNumber || "",
      });
      if (user.avatar || org.logo) {
        setUploadedLogo(user.avatar || org.logo);
      }
    }
  }, [user]);

  // Check follow status from API on mount or when user/orgId changes
  useEffect(() => {
    if (!orgId) return;

    if (Array.isArray(user?.followers)) {
      setFollowersCount(user.followers.length);
    }

    const checkFollowStatus = async () => {
      try {
        const res = await api.get(`/users/follow-status/${encodeURIComponent(orgId)}`);
        if (res.data) {
          if (typeof res.data.isFollowing === "boolean") {
            setIsFollowing(res.data.isFollowing);
          }
          if (typeof res.data.followersCount === "number") {
            setFollowersCount(res.data.followersCount);
          }
        }
      } catch (err) {
        // Fallback: check localStorage user
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed.followedOrganisations)) {
              setIsFollowing(parsed.followedOrganisations.includes(String(orgId)));
            }
          }
        } catch (_) {}
      }
    };

    checkFollowStatus();
  }, [orgId, user]);

  // Uploaded logo vs default company profile image
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(
    user?.avatar || orgDetails.logo || user?.picture || null
  );
  const defaultLogo = "/org-logo.jpg";
  const logoSrc = uploadedLogo || defaultLogo;
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Default background banner image (exact same as individual profile)
  const defaultBanner = "/profile-bg.png";
  const bannerSrc = user?.banner || orgDetails.banner || defaultBanner;

  // Inline Section-by-Section Edit States (matching individual profile ui design)
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedCompanyName, setEditedCompanyName] = useState("");
  const [editedTagline, setEditedTagline] = useState("");

  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState("");

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState("");

  const [isEditingServices, setIsEditingServices] = useState(false);
  const [editedExpertise, setEditedExpertise] = useState<string[]>([]);
  const [newServiceInput, setNewServiceInput] = useState("");

  // Sidebar Overview inline edit states
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [editedWebsite, setEditedWebsite] = useState("");

  const [isEditingSectors, setIsEditingSectors] = useState(false);
  const [editedOverviewSectors, setEditedOverviewSectors] = useState<string[]>([]);
  const [newSectorInput, setNewSectorInput] = useState("");

  const [isEditingCompanySize, setIsEditingCompanySize] = useState(false);
  const [editedCompanySize, setEditedCompanySize] = useState("");

  const [isEditingHeadquarters, setIsEditingHeadquarters] = useState(false);
  const [editedHeadquarters, setEditedHeadquarters] = useState("");

  const [isEditingOrgType, setIsEditingOrgType] = useState(false);
  const [editedOrgType, setEditedOrgType] = useState("");

  const [isEditingFounded, setIsEditingFounded] = useState(false);
  const [editedFounded, setEditedFounded] = useState("");

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Partial save handler that updates specific section fields both locally and in backend
  const handleSaveSection = async (overrides: Partial<OrganisationProfileData>) => {
    setIsSaving(true);
    try {
      const nextData: OrganisationProfileData = {
        ...profileData,
        ...overrides,
      };

      const payload = {
        name: nextData.companyName.trim(),
        about: nextData.about.trim(),
        headline: nextData.headline.trim(),
        phone: nextData.phone.trim(),
        website: nextData.website.trim(),
        companySize: nextData.companySize,
        headquarters: nextData.headquarters.trim(),
        organizationType: nextData.organizationType,
        founded: nextData.founded.trim(),
        expertise: nextData.expertise,
        gstNumber: nextData.gstNumber?.trim() || "",
        cinNumber: nextData.cinNumber?.trim() || "",
        avatar: uploadedLogo || undefined,
        organisationDetails: {
          companyName: nextData.companyName.trim(),
          about: nextData.about.trim(),
          headline: nextData.headline.trim(),
          website: nextData.website.trim(),
          linkedin: nextData.linkedin?.trim() || "",
          companySize: nextData.companySize,
          primaryUseCase: nextData.primaryUseCase,
          headquarters: nextData.headquarters.trim(),
          organizationType: nextData.organizationType,
          founded: nextData.founded.trim(),
          phone: nextData.phone.trim(),
          email: nextData.email.trim(),
          expertise: nextData.expertise,
          gstNumber: nextData.gstNumber?.trim() || "",
          cinNumber: nextData.cinNumber?.trim() || "",
          logo: uploadedLogo || undefined,
        },
      };

      let updatedResponse: any = null;

      // 1. Try local proxy route
      try {
        const proxyRes = await fetch("/api/users/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (proxyRes.ok) {
          updatedResponse = await proxyRes.json();
        }
      } catch (_) {}

      // 2. Direct API call fallback
      if (!updatedResponse) {
        try {
          const directRes = await api.patch("/users/profile", payload);
          updatedResponse = directRes.data;
        } catch (_) {}
      }

      setProfileData(nextData);

      try {
        const stored = localStorage.getItem("user");
        const existing = stored ? JSON.parse(stored) : {};
        const mergedUser = {
          ...existing,
          ...(updatedResponse || {}),
          name: nextData.companyName.trim(),
          about: nextData.about.trim(),
          headline: nextData.headline.trim(),
          phone: nextData.phone.trim(),
          organisationDetails: payload.organisationDetails,
        };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        if (onUpdateUser) {
          onUpdateUser(mergedUser);
        }
      } catch (_) {}

      toast({
        variant: "success",
        title: "Profile Saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (err: any) {
      console.error("Failed to update organisation profile:", err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err?.message || "Could not save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setUploadedLogo(base64);
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.avatar = base64;
            if (!parsed.organisationDetails) parsed.organisationDetails = {};
            parsed.organisationDetails.logo = base64;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
        } catch (_) {}
        await handleSaveSection({});
        toast({
          variant: "success",
          title: "Logo Uploaded",
          description: "Company profile image has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Toggle follow handler
  const handleFollowToggle = async () => {
    if (!orgId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token && !storedUser) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to follow this organisation.",
      });
      return;
    }

    setIsFollowLoading(true);
    const targetState = !isFollowing;

    // Optimistic update
    setIsFollowing(targetState);
    setFollowersCount((prev) => Math.max(0, prev + (targetState ? 1 : -1)));

    try {
      const res = await api.post(`/users/toggle-follow/${encodeURIComponent(orgId)}`);
      if (res.data) {
        if (typeof res.data.isFollowing === "boolean") {
          setIsFollowing(res.data.isFollowing);
        }
        if (typeof res.data.followersCount === "number") {
          setFollowersCount(res.data.followersCount);
        }
      }

      // Update localStorage user followedOrganisations list
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const currentList: string[] = Array.isArray(parsed.followedOrganisations)
            ? [...parsed.followedOrganisations]
            : [];
          if (targetState) {
            if (!currentList.includes(String(orgId))) currentList.push(String(orgId));
          } else {
            const index = currentList.indexOf(String(orgId));
            if (index > -1) currentList.splice(index, 1);
          }
          parsed.followedOrganisations = currentList;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch (_) {}

      toast({
        variant: targetState ? "success" : "default",
        title: targetState ? "Following" : "Unfollowed",
        description: targetState
          ? `You are now following ${profileData.companyName}.`
          : `You have unfollowed ${profileData.companyName}.`,
      });
    } catch (err: any) {
      // Revert optimistic update
      setIsFollowing(!targetState);
      setFollowersCount((prev) => Math.max(0, prev + (targetState ? -1 : 1)));
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: err?.formattedMessage || err?.message || "Failed to update follow status. Please try again.",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Toggle like handler for posts
  const handleToggleLike = (postId: string) => {
    setPostLikes((prev) => {
      const current = prev[postId] || { count: 0, active: false };
      return {
        ...prev,
        [postId]: {
          count: current.active ? current.count - 1 : current.count + 1,
          active: !current.active,
        },
      };
    });
  };

  // Jobs mock list with interactive status updating
  const [jobsList, setJobsList] = useState([
    {
      id: "job-1",
      title: "Environmental Projects Manager",
      department: "Projects & Operations",
      location: "Chandigarh, India",
      workplaceType: "Remote",
      employmentType: "Full-time",
      postedAgo: "Posted 2 days ago",
      description:
        "Lead and manage environmental projects focused on renewable energy and sustainability initiatives. Collaborate with cross-functional teams to ensure timely delivery and measurable impact.",
      applicantsCount: "24 applicants applied",
      status: "Open Job",
      badgeText: "Under Review",
    },
    {
      id: "job-2",
      title: "ESG Consultant",
      department: "Sustainability & Advisory",
      location: "Mumbai, India",
      workplaceType: "On-site",
      employmentType: "Contract",
      postedAgo: "Posted 4 days ago",
      description:
        "Support organizations in integrating ESG practices, conducting assessments, and developing sustainability strategies for long-term value creation.",
      applicantsCount: "02 applicants applied",
      status: "Closed",
      badgeText: "",
    },
    {
      id: "job-3",
      title: "Clean Technology Analyst",
      department: "Research & Development",
      location: "Bengaluru, India",
      workplaceType: "Hybrid",
      employmentType: "Full-time",
      postedAgo: "Posted 1 week ago",
      description:
        "Conduct technical and economic feasibility assessments for emerging green technologies, carbon capture, and clean industrial transition projects.",
      applicantsCount: "38 applicants applied",
      status: "Open Job",
      badgeText: "Active",
    },
  ]);

  const handleUpdateJobStatus = (jobId: string, newStatus: string) => {
    setJobsList((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    setOpenStatusDropdownId(null);
    toast({
      variant: "success",
      title: "Job Status Updated",
      description: `Job status has been changed to "${newStatus}".`,
    });
  };

  // Filtered jobs
  const filteredJobs = jobsList.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.department.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.location.toLowerCase().includes(jobSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (jobStatusFilter === "Open Jobs") return job.status === "Open Job";
    if (jobStatusFilter === "Closed") return job.status === "Closed";
    if (jobStatusFilter === "Hired") return job.status === "Hired";
    return true;
  });

  const cleanWebsiteUrl = profileData.website.startsWith("http")
    ? profileData.website
    : `https://${profileData.website}`;

  const tagline = profileData.expertise && profileData.expertise.length > 0
    ? profileData.expertise.slice(0, 3).join(" | ")
    : "Renewable Energy | Sustainability | Clean Technology";

  // Dynamic services list generated from expertise
  const servicesList = profileData.expertise.slice(0, 4).map((item: string, idx: number) => {
    const words = item.split(" ");
    const code = words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : item.slice(0, 2).toUpperCase();
    return {
      code,
      title: item,
      description:
        item === "Renewable Energy"
          ? "Solar, wind and clean energy solutions for a sustainable tomorrow."
          : item === "ESG Consulting"
          ? "Helping businesses build responsible and sustainable practices."
          : item === "Clean Technology"
          ? "Innovative solutions for a cleaner and greener planet."
          : item === "Sustainability Solutions"
          ? "Environmental impact assessment, carbon footprint & more."
          : `Comprehensive environmental strategies and project delivery for ${item.toLowerCase()}.`,
    };
  });

  return (
    <div className="bg-[#f8faf9] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6 space-y-6">
        {/* ========================================================= */}
        {/* TOP PROFILE HERO CARD (Cover Image, Logo & Header Info) */}
        {/* ========================================================= */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative h-[160px] md:h-[180px] w-full">
            <Image
              src={bannerSrc}
              alt="Profile Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Profile Details Bar */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-start justify-between gap-6">
              {/* Logo + Titles */}
              <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 flex-1 w-full">
                {/* Overlapping Organisation Logo (Default unless uploaded) */}
                <div className="-mt-16 md:-mt-20 relative group h-36 w-36 sm:h-40 sm:w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center flex-shrink-0 z-10">
                  <Image
                    src={logoSrc}
                    alt={profileData.companyName}
                    width={140}
                    height={140}
                    className="object-contain w-full h-full p-2 rounded-xl"
                  />

                  {/* Upload overlay for company profile image if own profile */}
                  {isOwnProfile && (
                    <>
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                        title="Upload company profile image"
                      >
                        <Pencil className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">
                          {uploadedLogo ? "Change Logo" : "Upload Logo"}
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                    </>
                  )}
                </div>

                {/* Company Name & Meta */}
                <div className="pt-4 sm:pt-6 md:pt-8 pb-1 flex-1 w-full">
                  {isEditingName ? (
                    <div className="flex flex-col gap-3 w-full max-w-lg mt-1">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Company Name</label>
                        <input 
                          type="text" 
                          value={editedCompanyName} 
                          onChange={(e) => setEditedCompanyName(e.target.value)} 
                          className="text-2xl sm:text-3xl font-extrabold text-[#191919] bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          placeholder="e.g. Green Core Solutions"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Tagline / Subtitle</label>
                        <input 
                          type="text" 
                          value={editedTagline} 
                          onChange={(e) => setEditedTagline(e.target.value)} 
                          className="text-gray-500 font-medium bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm"
                          placeholder="e.g. Renewable Energy | Sustainability | Clean Technology"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsEditingName(false);
                            const tags = editedTagline.split("|").map((s) => s.trim()).filter(Boolean);
                            const overrides: Partial<OrganisationProfileData> = {
                              companyName: editedCompanyName,
                            };
                            if (tags.length > 0) {
                              overrides.expertise = tags;
                            }
                            await handleSaveSection(overrides);
                          }} 
                          className="bg-[#00B660] hover:bg-[#00a355] text-white font-medium"
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setIsEditingName(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight mt-1">
                          {profileData.companyName}
                        </h1>
                        <span className="inline-flex items-center text-teal-600" title="Verified Organisation">
                          <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                        </span>
                        {isOwnProfile && (
                          <div className="relative group">
                            <button 
                              onClick={() => {
                                setEditedCompanyName(profileData.companyName);
                                setEditedTagline(profileData.expertise.slice(0, 3).join(" | "));
                                setIsEditingName(true);
                              }}
                              className="h-8 w-8 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                            >
                              <Pencil className="h-4 w-4" fill="currentColor" strokeWidth={1} />
                            </button>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-10">
                              Edit Profile
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-sm sm:text-base font-medium text-gray-600 mt-1">
                        {tagline}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {profileData.headquarters}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {followersCount >= 1000 ? `${(followersCount / 1000).toFixed(1)}K` : followersCount} {followersCount === 1 ? "Follower" : "Followers"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons: [Share (for owner)] or [Follow / Following (for visitors)], [Message (visitors)], [...] */}
              <div className="flex items-center gap-2.5 pt-4 md:pt-8 flex-shrink-0">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const targetId = user?._id || user?.id;
                        const shareUrl = targetId
                          ? `${window.location.origin}/professionals/${targetId}`
                          : window.location.href;
                        navigator.clipboard?.writeText(shareUrl);
                        toast({
                          variant: "success",
                          title: "Link Copied!",
                          description: "Organisation profile link copied to clipboard.",
                        });
                      }
                    }}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                      isFollowing
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                        : "bg-[#00a86b] hover:bg-[#008f5b] text-white"
                    }`}
                  >
                    {isFollowLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    ) : isFollowing ? (
                      <Check className="w-4 h-4 mr-1.5" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1.5" />
                    )}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}

                {!isOwnProfile && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Direct Message",
                        description: `Opening messaging channel with ${profileData.companyName}...`,
                      });
                    }}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold border-2 border-[#1e6b52] text-[#1e6b52] hover:bg-[#f0fdf4] transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Message
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Organisation profile URL copied to clipboard.",
                    });
                  }}
                  title="Share profile"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TWO-COLUMN LAYOUT: (Main Tabs & Content + Right Sidebar) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT COLUMN (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Navigation Tabs Bar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
              {[
                { key: "Profile", label: "Profile", icon: Building2 },
                { key: "Posts", label: "Posts", icon: Newspaper },
                { key: "Jobs", label: "Jobs", icon: Briefcase },
                { key: "Tenders", label: "Tenders", icon: FileText },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-[#e6f4ea] text-[#1e6b52] border border-[#c7eed8] shadow-xs"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? "text-[#1e6b52]" : "text-gray-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ---------------------------------------------------- */}
            {/* TAB 1: PROFILE CONTENT (Matching Screenshot 1) */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Profile" && (
              <div className="space-y-6">
                {/* Headline & About Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-6">
                  {/* Headline */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Headline</h3>
                      {!isEditingHeadline && isOwnProfile && (
                        <div className="relative group">
                          <button 
                            onClick={() => {
                              setEditedHeadline(profileData.headline);
                              setIsEditingHeadline(true);
                            }}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-10">
                            Edit Headline
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {isEditingHeadline ? (
                      <div className="flex flex-col gap-3 w-full">
                        <textarea 
                          value={editedHeadline} 
                          onChange={(e) => setEditedHeadline(e.target.value)} 
                          className="text-gray-600 leading-relaxed bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 w-full min-h-[80px]"
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingHeadline(false);
                              await handleSaveSection({ headline: editedHeadline });
                            }} 
                            className="bg-[#00B660] hover:bg-[#00a355] text-white font-medium"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingHeadline(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {profileData.headline || (
                          <span className="text-gray-400 italic">No headline added yet. Click the edit icon to add a headline.</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* About */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">About</h3>
                      {!isEditingAbout && isOwnProfile && (
                        <div className="relative group">
                          <button 
                            onClick={() => {
                              setEditedAbout(profileData.about);
                              setIsEditingAbout(true);
                            }}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-10">
                            Edit About
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {isEditingAbout ? (
                      <div className="flex flex-col gap-3 w-full">
                        <textarea 
                          value={editedAbout} 
                          onChange={(e) => setEditedAbout(e.target.value)} 
                          className="text-gray-500 leading-relaxed bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 w-full min-h-[150px]"
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingAbout(false);
                              await handleSaveSection({ about: editedAbout });
                            }} 
                            className="bg-[#00B660] hover:bg-[#00a355] text-white font-medium"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingAbout(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 leading-relaxed space-y-3 font-normal whitespace-pre-line">
                        {profileData.about || (
                          <span className="text-gray-400 italic">No about bio added yet. Click the edit icon to add your bio.</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow Company Page Banner (Only shown with Follow button for visitors) */}
                <div className="bg-[#e6f4ea] border border-[#c7eed8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#d2edd9] flex items-center justify-center text-[#1e6b52] flex-shrink-0">
                      <Mail className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        {isOwnProfile ? "Keep your company profile up to date" : "Follow our company page for regular updates"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        Solar, wind and clean energy solutions for a sustainable tomorrow.
                      </p>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollowToggle}
                      className="bg-[#1e6b52] hover:bg-[#154d3b] text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 flex-shrink-0 transition-all shadow-xs"
                    >
                      <span>{isFollowing ? "Following" : "+ Follow"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Services / Specialties Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-[#191919]">
                        Services / Specialties
                      </h3>
                      {!isEditingServices && isOwnProfile && (
                        <div className="relative group">
                          <button 
                            onClick={() => {
                              setEditedExpertise([...profileData.expertise]);
                              setIsEditingServices(true);
                            }}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-10">
                            Edit Services
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {!isOwnProfile && (
                      <button
                        onClick={() => setActiveTab("Posts")}
                        className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#1e6b52] flex items-center gap-1 transition-colors"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditingServices ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {editedExpertise.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100 flex items-center gap-2"
                          >
                            {item}
                            <button 
                              type="button"
                              onClick={() => setEditedExpertise(editedExpertise.filter((_, i) => i !== idx))}
                              className="hover:text-red-500 font-bold ml-1 text-base leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add custom service or specialty */}
                      <div className="flex gap-2 max-w-md">
                        <input 
                          type="text" 
                          value={newServiceInput} 
                          onChange={(e) => setNewServiceInput(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = newServiceInput.trim();
                              if (val && !editedExpertise.includes(val)) {
                                setEditedExpertise([...editedExpertise, val]);
                                setNewServiceInput("");
                              }
                            }
                          }}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="Add custom service or specialty..."
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const val = newServiceInput.trim();
                            if (val && !editedExpertise.includes(val)) {
                              setEditedExpertise([...editedExpertise, val]);
                              setNewServiceInput("");
                            }
                          }}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Preset suggestions */}
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1.5">Suggestions:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_EXPERTISE.filter((p) => !editedExpertise.includes(p)).slice(0, 6).map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setEditedExpertise([...editedExpertise, preset])}
                              className="px-2.5 py-1 rounded-md text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1"
                            >
                              <span>+</span>
                              <span>{preset}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Button 
                          size="sm" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsEditingServices(false);
                            await handleSaveSection({ expertise: editedExpertise });
                          }} 
                          className="bg-[#00B660] hover:bg-[#00a355] text-white font-medium"
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditingServices(false);
                            setEditedExpertise([...profileData.expertise]);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {servicesList.map((service: { code: string; title: string; description: string }, index: number) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl border border-gray-100 p-4 hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#1e6b52] font-bold text-xs flex items-center justify-center border border-[#c7eed8]">
                              {service.code}
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mt-3 leading-snug">
                              {service.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 2: POSTS CONTENT (Matching Screenshot 2) */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Posts" && (
              <div className="space-y-6">
                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { key: "All", label: "All", icon: null },
                    { key: "Videos", label: "Videos", icon: Video },
                    { key: "Jobs", label: "Jobs", icon: Briefcase },
                    { key: "Tenders", label: "Tenders", icon: FileText },
                    { key: "News", label: "News", icon: Newspaper },
                  ].map((filter) => {
                    const isActive = postFilter === filter.key;
                    const IconComp = filter.icon;
                    return (
                      <button
                        key={filter.key}
                        onClick={() => setPostFilter(filter.key as any)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#00a86b] text-white shadow-xs"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {IconComp && <IconComp className="w-3.5 h-3.5" />}
                        {filter.label}
                      </button>
                    );
                  })}
                </div>

                {/* POST 1: News Post with Renewable Energy Thumbnail */}
                {(postFilter === "All" || postFilter === "News") && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 p-0.5 flex-shrink-0">
                          <Image
                            src={logoSrc}
                            alt={profileData.companyName}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">
                              {profileData.companyName}
                            </span>
                            <CheckCircle2 className="w-4 h-4 fill-teal-600 text-white" />
                          </div>
                          <p className="text-xs text-gray-400">
                            2h ago &bull; <Globe className="w-3 h-3 inline text-gray-400" /> Public
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e6b52] border border-[#c7eed8]">
                          News
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Text Body */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      India's renewable energy capacity is set to grow by 12% in 2025, driven by increasing investments in solar and wind projects. This marks a significant step towards a cleaner, greener and more sustainable future.
                    </p>

                    <p className="text-xs text-emerald-700 font-semibold space-x-1.5">
                      <span>#RenewableEnergy</span>
                      <span>#CleanEnergy</span>
                      <span>#Sustainability</span>
                      <span>#GreenFuture</span>
                    </p>

                    {/* Attached News Article Card */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50 flex flex-col md:flex-row hover:border-gray-300 transition-all">
                      <div className="relative w-full md:w-5/12 h-44 bg-gray-200 flex-shrink-0">
                        <Image
                          src="/services.jpg"
                          alt="Wind Turbines"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 320px"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                            India's Renewable Energy Capacity Set to Grow by 12% in 2025
                          </h4>
                          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                            New investments and policy support are accelerating the country's clean energy transition, say industry experts.
                          </p>
                        </div>
                        <a
                          href="https://www.business-standard.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-gray-700 font-medium hover:text-[#1e6b52] flex items-center gap-1 mt-3"
                        >
                          <Globe className="w-3.5 h-3.5 text-gray-500" />
                          <span>www.business-standard.com</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      </div>
                    </div>

                    {/* Reactions Bar */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleToggleLike("post1")}
                          className={`flex items-center gap-1.5 transition-colors ${
                            postLikes.post1.active ? "text-[#00a86b] font-bold" : "hover:text-gray-900"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${postLikes.post1.active ? "fill-[#00a86b]" : ""}`} />
                          <span>{postLikes.post1.count}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>12</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                          <Repeat2 className="w-4 h-4" />
                          <span>25</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          toast({ title: "Post link copied to clipboard!" });
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* POST 2: Tender Alert Post */}
                {(postFilter === "All" || postFilter === "Tenders") && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 p-0.5 flex-shrink-0">
                          <Image
                            src={logoSrc}
                            alt={profileData.companyName}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">
                              {profileData.companyName}
                            </span>
                            <CheckCircle2 className="w-4 h-4 fill-teal-600 text-white" />
                          </div>
                          <p className="text-xs text-gray-400">
                            1 Day ago &bull; <Globe className="w-3 h-3 inline text-gray-400" /> Public
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Tender Alert
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Text */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      New Tender Alert! Ministry of Environment, Forest and Climate Change has released a tender for "Consultancy Services for Environmental Impact Assessment (EIA) Studies".
                      <br />
                      Interested? Check the details and apply now.
                    </p>

                    {/* Attached Doc Card */}
                    <div className="rounded-xl border border-emerald-200 bg-[#f8fdf9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-emerald-100 text-[#1e6b52] flex items-center justify-center flex-shrink-0 border border-emerald-200">
                          <FileText className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-snug">
                            EIA Consultancy Services &ndash; Tender Notice
                          </h4>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Ministry of Environment, Forest and Climate Change
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 font-medium">
                            PDF &bull; 2.4 MB
                          </p>
                        </div>
                      </div>

                      <Link href="/tenders">
                        <Button className="bg-[#1e6b52] hover:bg-[#154d3b] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 flex-shrink-0">
                          <span>View Tender</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-emerald-700 font-semibold space-x-1.5">
                      <span>#TenderAlert</span>
                      <span>#EIA</span>
                      <span>#Consultancy</span>
                      <span>#Environment</span>
                    </p>

                    {/* Reactions Bar */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleToggleLike("post2")}
                          className={`flex items-center gap-1.5 transition-colors ${
                            postLikes.post2.active ? "text-[#00a86b] font-bold" : "hover:text-gray-900"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${postLikes.post2.active ? "fill-[#00a86b]" : ""}`} />
                          <span>{postLikes.post2.count}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>11</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                          <Repeat2 className="w-4 h-4" />
                          <span>22</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          toast({ title: "Post link copied to clipboard!" });
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 3: JOBS CONTENT (Matching Screenshot 3) */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Jobs" && (
              <div className="space-y-6">
                {/* Search Bar Input */}
                <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex items-center gap-3">
                  <div className="pl-3 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Job title, Skills or Company"
                    className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                  />
                  <Button
                    onClick={() => {}}
                    className="bg-[#1e6b52] hover:bg-[#154d3b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
                  >
                    Search
                  </Button>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-2">
                  {(["Open Jobs", "Closed", "Hired"] as const).map((filter) => {
                    const isActive = jobStatusFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setJobStatusFilter(filter)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#e6f4ea] text-[#1e6b52] border border-[#c7eed8]"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                {/* Job Cards List */}
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-700">No jobs found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search query or filter.
                      </p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl border border-[#2d6a4f]/30 p-6 shadow-sm hover:border-[#1e6b52] transition-all relative"
                      >
                        {/* Top-Right Tag Badge (if any) */}
                        {job.badgeText && (
                          <div className="absolute top-6 right-6">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e6b52] border border-[#c7eed8]">
                              {job.badgeText}
                            </span>
                          </div>
                        )}

                        {/* Top Info */}
                        <div className="flex items-start gap-4 pr-24">
                          <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#1e6b52] font-bold text-sm flex items-center justify-center flex-shrink-0 border border-[#c7eed8]">
                            {job.id === "job-2" ? "EJ" : (
                              <Building2 className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug">
                              {job.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                              {job.department}
                            </p>
                            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{job.location}</span>
                              <span className="text-gray-300">|</span>
                              <span>{job.workplaceType}</span>
                              <span className="text-gray-300">|</span>
                              <span>{job.employmentType}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{job.postedAgo}</span>
                            </p>
                          </div>
                        </div>

                        {/* Job Description */}
                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Bottom Bar: Applicants & Action Buttons */}
                        <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <p className="text-xs text-gray-600 font-semibold flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{job.applicantsCount}</span>
                          </p>

                          <div className="flex items-center gap-2 relative">
                            <Link href={`/jobs/${job.id}`}>
                              <Button
                                variant="secondary"
                                className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                              >
                                View Details
                              </Button>
                            </Link>

                            {/* Status Selector Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenStatusDropdownId(
                                    openStatusDropdownId === job.id ? null : job.id
                                  )
                                }
                                className={`text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                                  job.status === "Closed"
                                    ? "bg-gray-400 text-white"
                                    : "border border-emerald-600 text-emerald-800 bg-white hover:bg-emerald-50"
                                }`}
                              >
                                <span>{job.status === "Open Job" ? "Status" : job.status}</span>
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>

                              {openStatusDropdownId === job.id && (
                                <div className="absolute right-0 bottom-full mb-1 z-30 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
                                  {["Open Job", "Closed", "Hired"].map((statusOption) => (
                                    <button
                                      key={statusOption}
                                      onClick={() => handleUpdateJobStatus(job.id, statusOption)}
                                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-emerald-50 hover:text-[#1e6b52] flex items-center justify-between ${
                                        job.status === statusOption
                                          ? "bg-emerald-50 text-[#1e6b52] font-bold"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <span>{statusOption}</span>
                                      {job.status === statusOption && (
                                        <Check className="w-3.5 h-3.5 text-[#1e6b52]" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 4: TENDERS CONTENT */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Tenders" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Organisation Tender Notices
                      </h3>
                      <p className="text-xs text-gray-500">
                        Environmental & green infrastructure tenders published by {profileData.companyName}
                      </p>
                    </div>
                    <Link href="/tenders">
                      <Button className="bg-[#1e6b52] hover:bg-[#154d3b] text-white text-xs font-semibold px-4 py-2 rounded-lg">
                        Browse All Tenders &rarr;
                      </Button>
                    </Link>
                  </div>

                  {/* Tender Card */}
                  <div className="rounded-xl border border-emerald-200 bg-[#f8fdf9] p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Active Tender
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-base mt-2">
                          Solar Rooftop Photovoltaic Systems Installation across Facilities
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Tender No: EJ-TN-2026-894 &bull; Category: Renewable Energy Infrastructure
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500">Estimated Value</p>
                        <p className="text-base font-extrabold text-emerald-800">&#8377;4.8 Crore</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      Inviting sealed bids from reputed and experienced engineering procurement contractors for rooftop solar installations and comprehensive 5-year maintenance.
                    </p>

                    <div className="border-t border-emerald-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                      <div className="flex items-center gap-3">
                        <span><strong>Deadline:</strong> Dec 15, 2026</span>
                        <span>&bull;</span>
                        <span><strong>Location:</strong> Bengaluru, Karnataka</span>
                      </div>
                      <Link href="/tenders">
                        <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs">
                          Download RFP &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Overview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Company Overview
                </h3>
              </div>

              <div className="space-y-4">
                {/* Website Link */}
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Website</p>
                      {!isEditingWebsite && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedWebsite(profileData.website);
                            setIsEditingWebsite(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Website"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingWebsite ? (
                      <div className="mt-1 space-y-2">
                        <input 
                          type="text" 
                          value={editedWebsite} 
                          onChange={(e) => setEditedWebsite(e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                          placeholder="e.g. www.greencore.com"
                        />
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingWebsite(false);
                              await handleSaveSection({ website: editedWebsite });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingWebsite(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <a
                        href={cleanWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-sky-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>{profileData.website}</span>
                        <ExternalLink className="w-3 h-3 text-sky-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Verified Page */}
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Verified Page</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      Verified since March 2024
                    </p>
                  </div>
                </div>

                {/* Industry / Sectors */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Industry / Sectors</p>
                      {!isEditingSectors && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedOverviewSectors(profileData.expertise.slice(0, 3));
                            setIsEditingSectors(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Sectors"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingSectors ? (
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {editedOverviewSectors.map((sector, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                              {sector}
                              <button 
                                type="button" 
                                onClick={() => setEditedOverviewSectors(editedOverviewSectors.filter((_, i) => i !== idx))} 
                                className="hover:text-red-500 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={newSectorInput} 
                            onChange={(e) => setNewSectorInput(e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newSectorInput.trim() && !editedOverviewSectors.includes(newSectorInput.trim())) {
                                  setEditedOverviewSectors([...editedOverviewSectors, newSectorInput.trim()]);
                                  setNewSectorInput("");
                                }
                              }
                            }}
                            className="flex-1 w-full bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                            placeholder="Add sector..."
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="h-auto py-1 px-2 text-xs"
                            onClick={() => {
                              if (newSectorInput.trim() && !editedOverviewSectors.includes(newSectorInput.trim())) {
                                setEditedOverviewSectors([...editedOverviewSectors, newSectorInput.trim()]);
                                setNewSectorInput("");
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingSectors(false);
                              const remaining = profileData.expertise.slice(3);
                              const combined = Array.from(new Set([...editedOverviewSectors, ...remaining]));
                              await handleSaveSection({ expertise: combined });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditingSectors(false);
                              setNewSectorInput("");
                            }} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {profileData.expertise.slice(0, 3).map((exp: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Size */}
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Company Size</p>
                      {!isEditingCompanySize && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedCompanySize(profileData.companySize);
                            setIsEditingCompanySize(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Company Size"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingCompanySize ? (
                      <div className="mt-1 space-y-2">
                        <select
                          value={editedCompanySize}
                          onChange={(e) => setEditedCompanySize(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                        >
                          {COMPANY_SIZE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingCompanySize(false);
                              await handleSaveSection({ companySize: editedCompanySize });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingCompanySize(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {profileData.companySize}
                      </p>
                    )}
                  </div>
                </div>

                {/* Headquarters */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Headquarters</p>
                      {!isEditingHeadquarters && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedHeadquarters(profileData.headquarters);
                            setIsEditingHeadquarters(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Headquarters"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingHeadquarters ? (
                      <div className="mt-1 space-y-2">
                        <input 
                          type="text" 
                          value={editedHeadquarters} 
                          onChange={(e) => setEditedHeadquarters(e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                          placeholder="e.g. New Delhi, India"
                        />
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingHeadquarters(false);
                              await handleSaveSection({ headquarters: editedHeadquarters });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingHeadquarters(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {profileData.headquarters}
                      </p>
                    )}
                  </div>
                </div>

                {/* Organization Type */}
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Organization Type</p>
                      {!isEditingOrgType && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedOrgType(profileData.organizationType);
                            setIsEditingOrgType(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Organization Type"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingOrgType ? (
                      <div className="mt-1 space-y-2">
                        <select
                          value={editedOrgType}
                          onChange={(e) => setEditedOrgType(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                        >
                          {ORG_TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingOrgType(false);
                              await handleSaveSection({ organizationType: editedOrgType });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingOrgType(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {profileData.organizationType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Founded */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Founded</p>
                      {!isEditingFounded && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedFounded(profileData.founded);
                            setIsEditingFounded(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Founded Year"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingFounded ? (
                      <div className="mt-1 space-y-2">
                        <input 
                          type="text" 
                          value={editedFounded} 
                          onChange={(e) => setEditedFounded(e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                          placeholder="e.g. 2014"
                        />
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingFounded(false);
                              await handleSaveSection({ founded: editedFounded });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingFounded(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {profileData.founded}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-medium">Contact Details</p>
                      {!isEditingContact && isOwnProfile && (
                        <button 
                          onClick={() => {
                            setEditedPhone(profileData.phone);
                            setEditedEmail(profileData.email);
                            setIsEditingContact(true);
                          }}
                          className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                          title="Edit Contact Details"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {isEditingContact ? (
                      <div className="mt-1 space-y-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Phone</label>
                          <input 
                            type="text" 
                            value={editedPhone} 
                            onChange={(e) => setEditedPhone(e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                            placeholder="+91 856568552"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Email</label>
                          <input 
                            type="email" 
                            value={editedEmail} 
                            onChange={(e) => setEditedEmail(e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                            placeholder="contact@greencore.com"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            disabled={isSaving}
                            onClick={async () => {
                              setIsEditingContact(false);
                              await handleSaveSection({ phone: editedPhone, email: editedEmail });
                            }} 
                            className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsEditingContact(false)} 
                            className="h-auto py-1 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-0.5 space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{profileData.phone}</span>
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-800 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{profileData.email}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* HIRING? Promo Card */}
            <div className="bg-[#e8f7f0] border border-[#c7eed8] rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 tracking-wider uppercase">
                  HIRING?
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                  Contact us and we will help you choose the best candidate
                </p>
              </div>

              <div className="relative w-full h-44 rounded-xl overflow-hidden">
                <Image
                  src="/hiring-illustration.jpg"
                  alt="Hiring Support"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </div>

              <Link href="/professionals" className="block">
                <Button className="w-full bg-[#00a86b] hover:bg-[#008f5b] text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm transition-all">
                  Know More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
