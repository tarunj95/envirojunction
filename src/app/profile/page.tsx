"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
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
  BarChart3,
  Eye,
  EyeOff,
  Sparkles,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import banner from "../../../public/profile-bg.png"
import hiringImg from "../../../public/hiring-illustration.jpg"
import { useUser } from "@auth0/nextjs-auth0/client";
import { syncSocialUserWithBackend } from "@/utils/auth";
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Typography, { TypographyProps } from '@mui/material/Typography';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Short bio");
  const { user, isLoading } = useUser();
  const [revealedEmail, setRevealedEmail] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);
  const [isSparklingEmail, setIsSparklingEmail] = useState(false);
  const [isSparklingPhone, setIsSparklingPhone] = useState(false);
  const [localUserData, setLocalUserData] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("UI/UX Expert , Front End , Environment Activist");

  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState("Environmental management expert having 20+ years of experience in the waste management industry with exposure in the indian region.");

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState("Hey there! Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");

  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [editedEducations, setEditedEducations] = useState([
    { id: 1, title: "Master of Design", university: "Stanford University", years: "2012 - 2014" },
    { id: 2, title: "Bachelor of Graphic Design", university: "University of California", years: "2008 - 2012" }
  ]);

  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [editedCertifications, setEditedCertifications] = useState([
    { id: 1, title: "Adobe Photoshop", issuer: "Adobe", years: "2012 - 2019" },
    { id: 2, title: "Adobe Illustrations", issuer: "Adobe", years: "2008 - 2020" }
  ]);

  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editedExperiences, setEditedExperiences] = useState([
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Facebook Inc.",
      startDate: "2019",
      endDate: "2021",
      description: "Created and maintained design systems. Conducted user research and usability testing to improve product experiences.",
      active: true,
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Google LLC",
      startDate: "2016",
      endDate: "2019",
      description: "Designed user interfaces for web and mobile applications. Collaborated with development teams to ensure design implementation.",
      active: false,
    },
    {
      id: 3,
      title: "Junior Designer",
      company: "Microsoft Corp",
      startDate: "2014",
      endDate: "2016",
      description: "Assisted senior designers in creating marketing materials and product designs.",
      active: false,
    },
  ]);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState([
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
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [isEditingServices, setIsEditingServices] = useState(false);
  const [editedServices, setEditedServices] = useState([
    { id: 1, title: "Waste Management Consulting", icon: <Recycle className="h-4 w-4" /> },
    { id: 2, title: "Environmental Impact Assessment (EIA)", icon: <ClipboardList className="h-4 w-4" /> },
    { id: 3, title: "Sustainability Strategy Development", icon: <Lightbulb className="h-4 w-4" /> },
    { id: 4, title: "Solar Power System Design", icon: <Sun className="h-4 w-4" /> },
    { id: 5, title: "Wastewater Treatment Solutions", icon: <Droplets className="h-4 w-4" /> },
    { id: 6, title: "Carbon Auditing & Offsetting", icon: <Cloud className="h-4 w-4" /> },
    { id: 7, title: "Green Building Certification (LEED)", icon: <Building2 className="h-4 w-4" /> },
    { id: 8, title: "Circular Economy Implementation", icon: <RefreshCw className="h-4 w-4" /> },
    { id: 9, title: "Hazardous Material Management", icon: <ShieldAlert className="h-4 w-4" /> },
    { id: 10, title: "Biodiversity Conservation Planning", icon: <TreePine className="h-4 w-4" /> },
    { id: 11, title: "Renewable Energy Feasibility Studies", icon: <Zap className="h-4 w-4" /> },
    { id: 12, title: "Ambient Air Quality Monitoring", icon: <Wind className="h-4 w-4" /> },
    { id: 13, title: "Climate Change Adaptation Planning", icon: <Globe className="h-4 w-4" /> },
    { id: 14, title: "Ecological Restoration Services", icon: <Sprout className="h-4 w-4" /> },
    { id: 15, title: "ESG Reporting & Compliance", icon: <BarChart3 className="h-4 w-4" /> },
  ]);
  const [newServiceInput, setNewServiceInput] = useState("");

  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [editedLanguages, setEditedLanguages] = useState(["English", "Hindi", "Spanish"]);
  const [newLanguageInput, setNewLanguageInput] = useState("");

  const [isEditingSectors, setIsEditingSectors] = useState(false);
  const [editedSectors, setEditedSectors] = useState(["IT", "Agriculture"]);
  const [newSectorInput, setNewSectorInput] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState("+91 98765 43210");
  const [phoneError, setPhoneError] = useState("");

  const [editedProfilePic, setEditedProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop as string, croppedAreaPixels as any, 0);
      setEditedProfilePic(croppedImage);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelCrop = () => {
    setImageToCrop(null);
  };

  const [isEditingProjects, setIsEditingProjects] = useState(false);
  const [editedProjects, setEditedProjects] = useState([
    {
      id: 1,
      icon: <Leaf className="h-6 w-6 text-white" />,
      iconBg: "bg-green-500",
      org: "EnviroJunction",
      location: "New Delhi, IN",
      tags: "Sustainability, GIS",
      title: "Smart Waste Collection Network",
      type: "Full time",
      time: "2 months ago",
      description: "Designed and deployed an IoT-based waste bin monitoring system across 50+ urban zones, reducing collection costs by 35% through real-time route optimisation.",
      status: "Done",
    },
    {
      id: 2,
      icon: <Recycle className="h-6 w-6 text-white" />,
      iconBg: "bg-blue-500",
      org: "GreenCycle Org",
      location: "Mumbai, IN",
      tags: "Circular Economy, Policy",
      title: "Plastic Waste Reduction Campaign",
      type: "Contract",
      time: "5 months ago",
      description: "Led a city-wide initiative to divert 200+ tonnes of plastic waste annually through community recycling drives, corporate partnerships, and policy advocacy.",
      status: "Done",
    },
    {
      id: 3,
      icon: <Droplets className="h-6 w-6 text-white" />,
      iconBg: "bg-cyan-500",
      org: "AquaEarth Foundation",
      location: "Chennai, IN",
      tags: "Water Mgmt, NGO",
      title: "Wastewater Treatment & Reuse System",
      type: "Full time",
      time: "8 months ago",
      description: "Implemented a decentralised wastewater treatment plant serving 10,000 households, achieving 80% water reuse for agricultural purposes in drought-prone areas.",
      status: "Done",
    },
    {
      id: 4,
      icon: <Wind className="h-6 w-6 text-white" />,
      iconBg: "bg-purple-500",
      org: "CleanAir Collective",
      location: "Bengaluru, IN",
      tags: "Air Quality, Analytics",
      title: "Industrial Emission Monitoring Dashboard",
      type: "Part time",
      time: "1 year ago",
      description: "Built a real-time air quality analytics platform integrating 120+ sensors across industrial corridors, enabling regulatory compliance reporting and public transparency.",
      status: "Done",
    },
    {
      id: 5,
      icon: <Sun className="h-6 w-6 text-white" />,
      iconBg: "bg-orange-400",
      org: "SolarSweep Ventures",
      location: "Jaipur, IN",
      tags: "Renewable Energy, Waste-to-Energy",
      title: "Solar-Powered Composting Facility",
      type: "Contract",
      time: "1.5 years ago",
      description: "Developed an off-grid composting facility powered entirely by solar energy, converting 5 tonnes of organic municipal waste per day into fertiliser for local farms.",
      status: "Done",
    },
  ]);

  const [isEditingSkillsIntro, setIsEditingSkillsIntro] = useState(false);
  const [editedSkillsIntro, setEditedSkillsIntro] = useState(
    "Hello there! My name is Alan Walker. I am a graphic designer, and I'm very passionate and dedicated to my work. With 20 years experience as a professional a graphic designer, I have acquired the skills and knowledge necessary to make your project a success.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis illum fuga eveniet. Deleniti asperiores, commodi quae ipsum quas est itaque, ipsa, dolore beatae voluptates nemo blanditiis iste eius officia minus. Id nisi, consequuntur sunt impedit quidem, vitae mollitia!"
  );

  useEffect(() => {
    const fetchLocalUser = async () => {
      const localUserStr = localStorage.getItem('user');
      const localToken = localStorage.getItem('token');
      
      if (localUserStr && localToken) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (localUser && localUser.id) {
            const res = await fetch(`/api-backend/users/profile`, {
              headers: {
                'Authorization': `Bearer ${localToken}`
              }
            });
            if (res.ok) {
              const data = await res.json();
              setLocalUserData(data);
              if (data.name) setEditedName(data.name);
              if (data.title) setEditedRole(data.title);
              if (data.headline) setEditedHeadline(data.headline);
              if (data.about) setEditedAbout(data.about);
              if (data.phone) setEditedPhone(data.phone);
              if (data.professional_skills) setEditedSkills(data.professional_skills);
              if (data.sectors) setEditedSectors(data.sectors);
              if (data.languages) setEditedLanguages(data.languages);
              
              if (data.services) {
                setEditedServices(data.services.map((service: any, index: number) => ({
                  id: index,
                  title: typeof service === 'string' ? service : service.title || "",
                  icon: <Leaf className="h-4 w-4" />
                })));
              }
              
              if (data.education) {
                setEditedEducations(data.education.map((edu: any, index: number) => ({
                  id: index,
                  title: edu.title || "",
                  university: edu.name || "",
                  years: `${edu.start_year || ""} - ${edu.end_year || ""}`
                })));
              }
              
              if (data.certifications) {
                setEditedCertifications(data.certifications.map((cert: any, index: number) => ({
                  id: index,
                  title: cert.title || "",
                  issuer: cert.name || "",
                  years: `${cert.start_year || ""} - ${cert.end_year || ""}`
                })));
              }
              
              if (data.work_experience) {
                setEditedExperiences(data.work_experience.map((exp: any, index: number) => ({
                  id: index,
                  title: exp.title || "",
                  company: exp.name || "",
                  startDate: exp.start_year ? String(exp.start_year) : "",
                  endDate: exp.end_year ? String(exp.end_year) : "",
                  description: exp.about || "",
                  active: exp.isPresent || false
                })));
              }

              if (data.projects && Array.isArray(data.projects)) {
                setEditedProjects(data.projects.map((proj: any, index: number) => ({
                  id: index,
                  title: proj.title || "",
                  description: proj.description || "",
                  org: proj.name || "",
                  location: proj.location || "",
                  tags: "",
                  type: "",
                  time: "",
                  status: "Done",
                  icon: <Leaf className="h-6 w-6 text-white" />,
                  iconBg: "bg-green-500"
                })));
              }
            }
          }
        } catch (e) {
          console.error("Error fetching local user:", e);
        }
      }
    };

    fetchLocalUser();

    if (user) {
      if (user.name) {
        setEditedName(user.name);
      }
      syncSocialUserWithBackend(user).catch((err) => {
        console.warn('Backend social sync notice:', err?.message || err);
      });
    }
  }, [user]);

  const totalExperienceYears = useMemo(() => {
    let minYear = Infinity;
    let maxYear = -Infinity;
    const currentYear = new Date().getFullYear();
    
    editedExperiences.forEach(exp => {
      const start = parseInt(exp.startDate);
      const end = exp.active ? currentYear : parseInt(exp.endDate);
      
      if (!isNaN(start)) {
        minYear = Math.min(minYear, start);
      }
      if (!isNaN(end)) {
        maxYear = Math.max(maxYear, end);
      }
    });
    
    if (minYear !== Infinity && maxYear !== -Infinity && maxYear >= minYear) {
      return maxYear - minYear;
    }
    return 0;
  }, [editedExperiences]);

  const profileCompletion = useMemo(() => {
    let score = 10; // Base score
    if (editedHeadline?.trim() && editedAbout?.trim()) score += 30;
    else if (editedHeadline?.trim() || editedAbout?.trim()) score += 15;
    
    if (editedSkills && editedSkills.length > 0) score += 30;
    
    if (editedProjects && editedProjects.length > 0) score += 30;
    
    return Math.min(100, score);
  }, [editedHeadline, editedAbout, editedSkills, editedProjects]);

  const handleRevealEmail = () => {
    setIsSparklingEmail(true);
    setTimeout(() => {
      setRevealedEmail(true);
      setIsSparklingEmail(false);
    }, 1000);
  };

  const handleRevealPhone = () => {
    setIsSparklingPhone(true);
    setTimeout(() => {
      setRevealedPhone(true);
      setIsSparklingPhone(false);
    }, 1000);
  };

  const handleSaveProfile = async () => {
    try {
      const localUserStr = localStorage.getItem('user');
      const localToken = localStorage.getItem('token');
      if (!localUserStr || !localToken) return;

      const localUser = JSON.parse(localUserStr);
      if (!localUser.id) return;

      const payload = {
        name: editedName,
        title: editedRole,
        headline: editedHeadline,
        about: editedAbout,
        education: editedEducations.map(edu => {
          const years = edu.years ? edu.years.split('-') : [];
          return {
            title: edu.title,
            name: edu.university,
            start_year: parseInt(years[0]?.trim()) || null,
            end_year: parseInt(years[1]?.trim()) || null
          };
        }),
        certifications: editedCertifications.map(cert => {
          const years = cert.years ? cert.years.split('-') : [];
          return {
            title: cert.title,
            name: cert.issuer,
            start_year: parseInt(years[0]?.trim()) || null,
            end_year: parseInt(years[1]?.trim()) || null
          };
        }),
        work_experience: editedExperiences.map(exp => ({
          title: exp.title,
          name: exp.company,
          start_year: parseInt(exp.startDate) || null,
          end_year: exp.active ? null : (parseInt(exp.endDate) || null),
          about: exp.description,
          isPresent: exp.active
        })),
        // projects: editedProjects.map(proj => ({
        //   title: proj.title,
        //   description: proj.description,
        //   name: proj.org,
        //   location: proj.location
        // })),
        professional_skills: editedSkills,
        services: editedServices.map(service => ({ title: service.title })),
        location: localUserData?.location || "Gurugram, India",
        sectors: editedSectors,
        phone: editedPhone,
        languages: editedLanguages
      };

      const res = await fetch(`/api-backend/users/${localUser.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile", await res.text());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const tabs = [
    { name: "Short bio", icon: <FileText className="h-4 w-4" /> },
    { name: "Skills", icon: <Zap className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#F8FAF9] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
            <Skeleton variant="rectangular" height={150} className="w-full" animation="wave" />
            <div className="px-8 pb-8">
              <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-20">
                <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                </div>
                <div className="flex-1 pb-2">
                  <Skeleton variant="text" width="60%" height={40} animation="wave" />
                  <Skeleton variant="text" width="40%" height={24} animation="wave" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex gap-4 border-b border-gray-100 pb-6 mb-8">
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
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
              {[1, 2, 3, 4, 5, 6].map((i) => (
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

  return (
    <>
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Crop Profile Picture</h3>
              <button onClick={handleCancelCrop} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="font-bold text-xl leading-none">&times;</span>
              </button>
            </div>
            <div className="relative h-80 w-full bg-gray-900">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 bg-gray-50 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 flex-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00B660]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelCrop}>Cancel</Button>
                <Button className="bg-[#00B660] hover:bg-[#00a355] text-white" onClick={handleSaveCrop}>Save Image</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#F8FAF9] min-h-screen pb-20">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative h-[150px] w-full">
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
              <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center group">
                {editedProfilePic || user?.picture ? (
                  <img
                    src={editedProfilePic || user?.picture || ""}
                    alt={user?.name || localUserData?.name || "Profile"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-[#E8F5E9] text-[#00B660]">
                    <span className="text-6xl font-bold uppercase">
                      {(editedName || user?.name || localUserData?.name || "U")[0]}
                    </span>
                  </div>
                )}
                
                {/* Edit overlay */}
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-6 w-6 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleProfilePicChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="flex-1 pb-2">
                {isEditing ? (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full mt-4 md:mt-0">
                    <div className="flex flex-col gap-3 flex-1 w-full max-w-md">
                      <input 
                        type="text" 
                        value={editedName} 
                        onChange={(e) => setEditedName(e.target.value)} 
                        className="text-3xl font-bold text-[#191919] bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                      />
                      <input 
                        type="text" 
                        value={editedRole} 
                        onChange={(e) => setEditedRole(e.target.value)} 
                        className="text-gray-500 font-medium bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto mb-2 md:mb-0">
                      <Button size="sm" onClick={() => { setIsEditing(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-wrap w-full">
                      <h1 className="text-3xl font-bold text-[#191919]">{editedName || user?.name || localUserData?.name}</h1>
                      
                      <div className="relative group">
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="h-8 w-8 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Pencil className="h-4 w-4" fill="currentColor" strokeWidth={1} />
                        </button>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-10">
                          Edit Profile
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>

                      {/* Profile Completion Bar */}
                      {profileCompletion < 100 && (
                        <div className="flex flex-col items-end gap-1.5 ml-auto mt-2 md:mt-0">
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#00B660] rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${profileCompletion}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#00B660]">{profileCompletion}%</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium pr-1">
                            Complete your profile to stand out!
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 font-medium mt-1">
                      {editedRole}
                    </p>
                  </>
                )}
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
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Headline</h3>
                      {!isEditingHeadline && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingHeadline(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
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
                          <Button size="sm" onClick={() => { setIsEditingHeadline(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingHeadline(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {editedHeadline}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">About</h3>
                      {!isEditingAbout && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingAbout(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
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
                          <Button size="sm" onClick={() => { setIsEditingAbout(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingAbout(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 leading-relaxed">
                        {editedAbout}
                      </p>
                    )}
                  </div>

                  {/* Education */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Education</h3>
                      {!isEditingEducation && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingEducation(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingEducation ? (
                      <div className="space-y-6">
                        {editedEducations.map((edu, index) => (
                          <div key={edu.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                            <button 
                              onClick={() => {
                                const newEd = [...editedEducations];
                                newEd.splice(index, 1);
                                setEditedEducations(newEd);
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Education"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-8">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Title</label>
                                <input 
                                  type="text" 
                                  value={edu.title} 
                                  onChange={(e) => {
                                    const newEd = [...editedEducations];
                                    newEd[index].title = e.target.value;
                                    setEditedEducations(newEd);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Master of Design"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">University / College</label>
                                <input 
                                  type="text" 
                                  value={edu.university} 
                                  onChange={(e) => {
                                    const newEd = [...editedEducations];
                                    newEd[index].university = e.target.value;
                                    setEditedEducations(newEd);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Stanford University"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Years (From - To)</label>
                                <input 
                                  type="text" 
                                  value={edu.years} 
                                  onChange={(e) => {
                                    const newEd = [...editedEducations];
                                    newEd[index].years = e.target.value;
                                    setEditedEducations(newEd);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. 2012 - 2014"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditedEducations([...editedEducations, { id: Date.now(), title: "", university: "", years: "" }])}
                          className="w-full border-dashed border-2 text-gray-500 hover:text-green-600 hover:bg-green-50 hover:border-green-200"
                        >
                          + Add Education
                        </Button>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingEducation(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingEducation(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editedEducations.map((edu) => (
                          <div key={edu.id}>
                            <p className="font-semibold text-gray-900">{edu.title}</p>
                            <p className="text-gray-500 text-sm">{edu.university} {edu.university && edu.years && "•"} {edu.years}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Certifications</h3>
                      {!isEditingCertifications && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingCertifications(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingCertifications ? (
                      <div className="space-y-6">
                        {editedCertifications.map((cert, index) => (
                          <div key={cert.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                            <button 
                              onClick={() => {
                                const newCerts = [...editedCertifications];
                                newCerts.splice(index, 1);
                                setEditedCertifications(newCerts);
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Certification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-8">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Title</label>
                                <input 
                                  type="text" 
                                  value={cert.title} 
                                  onChange={(e) => {
                                    const newCerts = [...editedCertifications];
                                    newCerts[index].title = e.target.value;
                                    setEditedCertifications(newCerts);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Adobe Photoshop"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Issuer</label>
                                <input 
                                  type="text" 
                                  value={cert.issuer} 
                                  onChange={(e) => {
                                    const newCerts = [...editedCertifications];
                                    newCerts[index].issuer = e.target.value;
                                    setEditedCertifications(newCerts);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Adobe"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Years (From - To)</label>
                                <input 
                                  type="text" 
                                  value={cert.years} 
                                  onChange={(e) => {
                                    const newCerts = [...editedCertifications];
                                    newCerts[index].years = e.target.value;
                                    setEditedCertifications(newCerts);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. 2012 - 2019"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditedCertifications([...editedCertifications, { id: Date.now(), title: "", issuer: "", years: "" }])}
                          className="w-full border-dashed border-2 text-gray-500 hover:text-green-600 hover:bg-green-50 hover:border-green-200"
                        >
                          + Add Certification
                        </Button>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingCertifications(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingCertifications(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editedCertifications.map((cert) => (
                          <div key={cert.id}>
                            <p className="font-semibold text-gray-900">{cert.title}</p>
                            <p className="text-gray-500 text-sm">{cert.issuer} {cert.issuer && cert.years && "•"} {cert.years}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-xl font-bold text-[#191919]">Work Experience</h3>
                      {!isEditingExperience && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingExperience(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingExperience ? (
                      <div className="space-y-6">
                        {editedExperiences.map((exp, index) => (
                          <div key={exp.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                            <button 
                              onClick={() => {
                                const newExps = [...editedExperiences];
                                newExps.splice(index, 1);
                                setEditedExperiences(newExps);
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Experience"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-8">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Title</label>
                                <input 
                                  type="text" 
                                  value={exp.title} 
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].title = e.target.value;
                                    setEditedExperiences(newExps);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Senior Product Designer"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Company</label>
                                <input 
                                  type="text" 
                                  value={exp.company} 
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].company = e.target.value;
                                    setEditedExperiences(newExps);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. Facebook Inc."
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Start Date</label>
                                <input 
                                  type="text" 
                                  value={exp.startDate} 
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].startDate = e.target.value;
                                    setEditedExperiences(newExps);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                  placeholder="e.g. 2019"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">End Date</label>
                                <input 
                                  type="text" 
                                  value={exp.endDate} 
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].endDate = e.target.value;
                                    setEditedExperiences(newExps);
                                  }} 
                                  disabled={exp.active}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                  placeholder={exp.active ? "Present" : "e.g. 2021"}
                                />
                              </div>
                              <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                <input 
                                  type="checkbox"
                                  checked={exp.active}
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].active = e.target.checked;
                                    setEditedExperiences(newExps);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600 cursor-pointer"
                                  id={`active-${exp.id}`}
                                />
                                <label htmlFor={`active-${exp.id}`} className="text-sm text-gray-600 cursor-pointer">Currently working here</label>
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                                <textarea 
                                  value={exp.description} 
                                  onChange={(e) => {
                                    const newExps = [...editedExperiences];
                                    newExps[index].description = e.target.value;
                                    setEditedExperiences(newExps);
                                  }} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[80px]"
                                  placeholder="Describe your role and achievements..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditedExperiences([...editedExperiences, { id: Date.now(), title: "", company: "", startDate: "", endDate: "", description: "", active: false }])}
                          className="w-full border-dashed border-2 text-gray-500 hover:text-green-600 hover:bg-green-50 hover:border-green-200"
                        >
                          + Add Experience
                        </Button>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingExperience(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingExperience(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {editedExperiences.map((exp, idx, arr) => (
                          <div key={exp.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`h-4 w-4 rounded-full mt-1 flex-shrink-0 ${exp.active ? "bg-green-500" : "bg-gray-300"}`} />
                              {idx < arr.length - 1 && (
                                <div className="w-px flex-1 bg-gray-200 my-1" />
                              )}
                            </div>
                            <div className={idx < arr.length - 1 ? "pb-8" : "pb-0"}>
                              <p className="font-semibold text-gray-900">{exp.title}</p>
                              <p className="text-gray-500 text-sm mb-2">
                                {exp.company} {exp.company && (exp.startDate || exp.endDate || exp.active) && "•"} {exp.startDate} {(exp.startDate || exp.endDate || exp.active) && "-"} {exp.active ? "Present" : exp.endDate}
                              </p>
                              <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Skills ── */}
              {activeTab === "Skills" && (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-[#191919]">Skills</h3>
                      {!isEditingSkillsIntro && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingSkillsIntro(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingSkillsIntro ? (
                      <div className="space-y-4 mb-4">
                        <textarea 
                          value={editedSkillsIntro} 
                          onChange={(e) => setEditedSkillsIntro(e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[150px]"
                        />
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingSkillsIntro(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingSkillsIntro(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 leading-relaxed mb-4 whitespace-pre-wrap">
                        {editedSkillsIntro}
                      </p>
                    )}
                  </div>

                  {/* Professional Skills */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-base font-bold text-[#191919]">Professional Skills</h3>
                      {!isEditingSkills && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingSkills(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {isEditingSkills ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {editedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100 flex items-center gap-2"
                            >
                              {skill}
                              <button 
                                onClick={() => setEditedSkills(editedSkills.filter((_, i) => i !== idx))}
                                className="hover:text-red-500 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                          <input 
                            type="text" 
                            value={newSkillInput} 
                            onChange={(e) => setNewSkillInput(e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newSkillInput.trim()) {
                                setEditedSkills([...editedSkills, newSkillInput.trim()]);
                                setNewSkillInput("");
                              }
                            }}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            placeholder="Add a skill (press Enter)"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (newSkillInput.trim()) {
                                setEditedSkills([...editedSkills, newSkillInput.trim()]);
                                setNewSkillInput("");
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingSkills(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsEditingSkills(false);
                            setNewSkillInput("");
                          }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {editedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Environment Services */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-base font-bold text-[#191919]">Services</h3>
                      {!isEditingServices && (
                        <div className="relative group">
                          <button 
                            onClick={() => setIsEditingServices(true)}
                            className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingServices ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {editedServices.map((service, idx) => (
                            <div
                              key={service.id}
                              className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 relative"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                                  {service.icon}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">
                                  {service.title}
                                </span>
                              </div>
                              <button 
                                onClick={() => setEditedServices(editedServices.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                          <input 
                            type="text" 
                            value={newServiceInput} 
                            onChange={(e) => setNewServiceInput(e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newServiceInput.trim()) {
                                setEditedServices([...editedServices, { id: Date.now(), title: newServiceInput.trim(), icon: <Leaf className="h-4 w-4" /> }]);
                                setNewServiceInput("");
                              }
                            }}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            placeholder="Add a service (press Enter)"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (newServiceInput.trim()) {
                                setEditedServices([...editedServices, { id: Date.now(), title: newServiceInput.trim(), icon: <Leaf className="h-4 w-4" /> }]);
                                setNewServiceInput("");
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => { setIsEditingServices(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsEditingServices(false);
                            setNewServiceInput("");
                          }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editedServices.map((service) => (
                          <div
                            key={service.id}
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
                    )}
                  </div>
                </>
              )}

              {/* ── Projects ── */}
              {activeTab === "Projects" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#191919]">Projects</h3>
                    {isEditingProjects ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { setIsEditingProjects(false); handleSaveProfile(); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditingProjects(false)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="relative group">
                        <button 
                          onClick={() => setIsEditingProjects(true)}
                          className="h-7 w-7 bg-[#3BA3FF] hover:bg-[#208deb] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Pencil className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Edit Projects
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {editedProjects.map((project, idx) => (
                    <div key={project.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow relative">
                      {isEditingProjects ? (
                        <div className="space-y-4">
                          <button 
                            onClick={() => setEditedProjects(editedProjects.filter((_, i) => i !== idx))}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Project Title</label>
                              <input type="text" value={project.title} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].title = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Organization</label>
                              <input type="text" value={project.org} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].org = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                              <input type="text" value={project.location} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].location = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tags (comma separated)</label>
                              <input type="text" value={project.tags} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].tags = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Type</label>
                              <input type="text" value={project.type} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].type = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">Time</label>
                              <input type="text" value={project.time} onChange={e => {
                                const newP = [...editedProjects]; newP[idx].time = e.target.value; setEditedProjects(newP);
                              }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                            <textarea value={project.description} onChange={e => {
                              const newP = [...editedProjects]; newP[idx].description = e.target.value; setEditedProjects(newP);
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[80px]" />
                          </div>
                        </div>
                      ) : (
                        <>
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
                              {project.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
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
                        </>
                      )}
                    </div>
                  ))}
                  
                  {isEditingProjects && (
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 py-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      onClick={() => setEditedProjects([
                        ...editedProjects, 
                        {
                          id: Date.now(),
                          icon: <Leaf className="h-6 w-6 text-white" />,
                          iconBg: "bg-gray-500",
                          org: "",
                          location: "",
                          tags: "",
                          title: "",
                          type: "",
                          time: "",
                          description: "",
                          status: "Done",
                        }
                      ])}
                    >
                      + Add Project
                    </Button>
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
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Experience</p>
                  <p className="text-gray-900 font-bold">{totalExperienceYears} Years</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Sectors</p>
                    {!isEditingSectors && (
                      <button 
                        onClick={() => setIsEditingSectors(true)}
                        className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {isEditingSectors ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {editedSectors.map((sector, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            {sector}
                            <button onClick={() => setEditedSectors(editedSectors.filter((_, i) => i !== idx))} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input 
                          type="text" 
                          value={newSectorInput} 
                          onChange={(e) => setNewSectorInput(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSectorInput.trim()) {
                              setEditedSectors([...editedSectors, newSectorInput.trim()]);
                              setNewSectorInput("");
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
                            if (newSectorInput.trim()) {
                              setEditedSectors([...editedSectors, newSectorInput.trim()]);
                              setNewSectorInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" onClick={() => { setIsEditingSectors(false); handleSaveProfile(); }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingSectors(false); setNewSectorInput(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {editedSectors.map((sector, idx) => {
                        const colors = [
                          "bg-blue-50 text-blue-600",
                          "bg-green-50 text-green-600",
                          "bg-purple-50 text-purple-600",
                          "bg-orange-50 text-orange-600"
                        ];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <Badge key={idx} variant="secondary" className={`${colorClass} border-none font-medium px-3`}>
                            {sector}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Language</p>
                    {!isEditingLanguage && (
                      <button 
                        onClick={() => setIsEditingLanguage(true)}
                        className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {isEditingLanguage ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {editedLanguages.map((lang, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            {lang}
                            <button onClick={() => setEditedLanguages(editedLanguages.filter((_, i) => i !== idx))} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input 
                          type="text" 
                          value={newLanguageInput} 
                          onChange={(e) => setNewLanguageInput(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newLanguageInput.trim()) {
                              setEditedLanguages([...editedLanguages, newLanguageInput.trim()]);
                              setNewLanguageInput("");
                            }
                          }}
                          className="flex-1 w-full bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-xs"
                          placeholder="Add language..."
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="h-auto py-1 px-2 text-xs"
                          onClick={() => {
                            if (newLanguageInput.trim()) {
                              setEditedLanguages([...editedLanguages, newLanguageInput.trim()]);
                              setNewLanguageInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" onClick={() => { setIsEditingLanguage(false); handleSaveProfile(); }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingLanguage(false); setNewLanguageInput(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-bold">{editedLanguages.join(", ")}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Education Level</p>
                  <p className="text-gray-900 font-bold">{editedEducations[0]?.title || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-gray-900 font-bold">{user?.email || localUserData?.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Phone Number</p>
                    {!isEditingPhone && (
                      <button 
                        onClick={() => setIsEditingPhone(true)}
                        className="text-gray-400 hover:text-[#3BA3FF] transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {isEditingPhone ? (
                    <div className="mt-1 space-y-2">
                      <input 
                        type="text" 
                        value={editedPhone} 
                        onChange={(e) => {
                          setEditedPhone(e.target.value);
                          if (phoneError) setPhoneError("");
                        }} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const digitCount = editedPhone.replace(/\D/g, '').length;
                            if (digitCount < 10 || digitCount > 15) {
                              setPhoneError("Please enter a valid phone number (10-15 digits)");
                            } else {
                              setPhoneError("");
                              setIsEditingPhone(false);
                            }
                          }
                        }}
                        className={cn(
                          "w-full bg-white border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3BA3FF] text-sm",
                          phoneError ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                        )}
                      />
                      {phoneError && <p className="text-red-500 text-[10px] mt-1">{phoneError}</p>}
                      <div className="flex items-center gap-1">
                        <Button size="sm" onClick={() => {
                          const digitCount = editedPhone.replace(/\D/g, '').length;
                          if (digitCount < 10 || digitCount > 15) {
                            setPhoneError("Please enter a valid phone number (10-15 digits)");
                          } else {
                            setPhoneError("");
                            setIsEditingPhone(false);
                            handleSaveProfile();
                          }
                        }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingPhone(false); setPhoneError(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-bold">{editedPhone}</p>
                  )}
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
                  src={hiringImg}
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
    </>
  );
}

const variants = [
  'h1',
  'h3',
  'body1',
  'caption',
] as readonly TypographyProps['variant'][];

function TypographyDemo(props: { loading?: boolean }) {
  const { loading = false } = props;

  return (
    <div>
      {variants.map((variant) => (
        <Typography component="div" key={variant} variant={variant}>
          {loading ? <Skeleton /> : variant}
        </Typography>
      ))}
    </div>
  );
}

function SkeletonTypography() {
  return (
    <Grid container spacing={8}>
      <Grid size="grow">
        <TypographyDemo loading />
      </Grid>
      <Grid size="grow">
        <TypographyDemo />
      </Grid>
    </Grid>
  );
}
