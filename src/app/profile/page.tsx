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
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Short bio");
  const { user, isLoading } = useUser();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [localUserData, setLocalUserData] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState("");

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState("");

  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [editedEducations, setEditedEducations] = useState<
    { id: string | number; title: string; university: string; years: string }[]
  >([]);

  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [editedCertifications, setEditedCertifications] = useState<
    { id: string | number; title: string; issuer: string; years: string }[]
  >([]);

  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editedExperiences, setEditedExperiences] = useState<
    {
      id: string | number;
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
      active: boolean;
    }[]
  >([]);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [isEditingServices, setIsEditingServices] = useState(false);
  const [editedServices, setEditedServices] = useState<
    { id: string | number; title: string; icon: React.ReactNode }[]
  >([]);
  const [newServiceInput, setNewServiceInput] = useState("");

  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [editedLanguages, setEditedLanguages] = useState<string[]>([]);
  const [newLanguageInput, setNewLanguageInput] = useState("");

  const [isEditingSectors, setIsEditingSectors] = useState(false);
  const [editedSectors, setEditedSectors] = useState<string[]>([]);
  const [newSectorInput, setNewSectorInput] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [editedProfilePic, setEditedProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isEditingProjects, setIsEditingProjects] = useState(false);
  const [editedProjects, setEditedProjects] = useState<any[]>([]);

  const [isEditingSkillsIntro, setIsEditingSkillsIntro] = useState(false);
  const [editedSkillsIntro, setEditedSkillsIntro] = useState("");

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

  const handleCancelCrop = () => {
    setImageToCrop(null);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await api.get('/users/profile');
        const data = res.data;
        if (data) {
          setLocalUserData(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data));
          }
          if (data.name) setEditedName(data.name);
          if (data.title) setEditedRole(data.title);
          if (data.headline) setEditedHeadline(data.headline);
          if (data.about) setEditedAbout(data.about);
          if (data.skills) setEditedSkillsIntro(data.skills);
          if (data.avatar) setEditedProfilePic(data.avatar);
          if (data.phone) setEditedPhone(data.phone);
          if (Array.isArray(data.professional_skills)) {
            setEditedSkills(data.professional_skills);
          }
          if (Array.isArray(data.sectors)) {
            setEditedSectors(data.sectors);
          }
          if (Array.isArray(data.languages)) {
            setEditedLanguages(data.languages);
          }
          if (Array.isArray(data.services)) {
            setEditedServices(
              data.services.map((service: any, index: number) => ({
                id: index,
                title: typeof service === 'string' ? service : service.title || '',
                icon: <Leaf className="h-4 w-4" />,
              }))
            );
          }
          if (Array.isArray(data.education)) {
            setEditedEducations(
              data.education.map((edu: any, index: number) => ({
                id: index,
                title: edu.title || '',
                university: edu.name || '',
                years:
                  edu.start_year || edu.end_year
                    ? `${edu.start_year || ''}${edu.start_year && edu.end_year ? ' - ' : ''}${edu.end_year || ''}`
                    : '',
              }))
            );
          }
          if (Array.isArray(data.certifications)) {
            setEditedCertifications(
              data.certifications.map((cert: any, index: number) => ({
                id: index,
                title: cert.title || '',
                issuer: cert.name || '',
                years:
                  cert.start_year || cert.end_year
                    ? `${cert.start_year || ''}${cert.start_year && cert.end_year ? ' - ' : ''}${cert.end_year || ''}`
                    : '',
              }))
            );
          }
          if (Array.isArray(data.work_experience)) {
            setEditedExperiences(
              data.work_experience.map((exp: any, index: number) => ({
                id: index,
                title: exp.title || '',
                company: exp.name || '',
                startDate: exp.start_year ? String(exp.start_year) : '',
                endDate: exp.end_year ? String(exp.end_year) : '',
                description: exp.about || '',
                active: Boolean(exp.isPresent),
              }))
            );
          }
          if (Array.isArray(data.projects)) {
            setEditedProjects(
              data.projects.map((proj: any, index: number) => ({
                id: index,
                title: proj.title || '',
                description: proj.details || proj.description || '',
                org: proj.name || '',
                location: proj.location || '',
                tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || ''),
                type: proj.projectType || proj.type || '',
                time: proj.date ? new Date(proj.date).toLocaleDateString() : (proj.time || ''),
                status: proj.status || 'Done',
                icon: <Leaf className="h-6 w-6 text-white" />,
                iconBg: 'bg-green-500',
              }))
            );
          }
        }
      } catch (e) {
        console.error('Error fetching user profile from backend:', e);
        try {
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            setLocalUserData(parsed);
            if (parsed.name) setEditedName(parsed.name);
            if (parsed.title) setEditedRole(parsed.title);
            if (parsed.headline) setEditedHeadline(parsed.headline);
            if (parsed.about) setEditedAbout(parsed.about);
            if (parsed.phone) setEditedPhone(parsed.phone);
          }
        } catch (_) {}
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();

    if (user) {
      if (user.name) {
        setEditedName((prev) => prev || user.name || '');
      }
      syncSocialUserWithBackend(user)
        .then(() => {
          fetchUserProfile();
        })
        .catch((err) => {
          console.warn('Backend social sync notice:', err?.message || err);
        });
    }
  }, [user]);

  const totalExperienceYears = useMemo(() => {
    let minYear = Infinity;
    let maxYear = -Infinity;
    const currentYear = new Date().getFullYear();

    editedExperiences.forEach((exp) => {
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
    let score = 0;
    if (editedName?.trim()) score += 10;
    if (editedRole?.trim()) score += 10;
    if (editedHeadline?.trim()) score += 15;
    if (editedAbout?.trim()) score += 15;
    if (editedPhone?.trim()) score += 10;
    if (editedSkills && editedSkills.length > 0) score += 15;
    if (editedExperiences && editedExperiences.length > 0) score += 15;
    if (editedEducations && editedEducations.length > 0) score += 10;
    return Math.min(100, score);
  }, [
    editedName,
    editedRole,
    editedHeadline,
    editedAbout,
    editedPhone,
    editedSkills,
    editedExperiences,
    editedEducations,
  ]);

  const parseYearNumber = (val: any): number | undefined => {
    if (!val) return undefined;
    const clean = String(val).replace(/\D/g, '').slice(0, 4);
    const num = parseInt(clean, 10);
    if (!isNaN(num) && num >= 1900 && num <= 2100) return num;
    return undefined;
  };

  const handleSaveProfile = async (overrides?: any) => {
    try {
      setIsSaving(true);

      const nameToSave = overrides?.name !== undefined ? overrides.name : editedName;
      const roleToSave = overrides?.title !== undefined ? overrides.title : editedRole;
      const headlineToSave = overrides?.headline !== undefined ? overrides.headline : editedHeadline;
      const aboutToSave = overrides?.about !== undefined ? overrides.about : editedAbout;
      const skillsIntroToSave = overrides?.skills !== undefined ? overrides.skills : editedSkillsIntro;
      const avatarToSave = overrides?.avatar !== undefined ? overrides.avatar : editedProfilePic;
      const phoneToSave = overrides?.phone !== undefined ? overrides.phone : editedPhone;
      const skillsToSave = overrides?.professional_skills !== undefined ? overrides.professional_skills : editedSkills;
      const sectorsToSave = overrides?.sectors !== undefined ? overrides.sectors : editedSectors;
      const languagesToSave = overrides?.languages !== undefined ? overrides.languages : editedLanguages;
      const servicesRaw = overrides?.services !== undefined ? overrides.services : editedServices;
      const educationsRaw = overrides?.education !== undefined ? overrides.education : editedEducations;
      const certsRaw = overrides?.certifications !== undefined ? overrides.certifications : editedCertifications;
      const expsRaw = overrides?.work_experience !== undefined ? overrides.work_experience : editedExperiences;
      const projectsRaw = overrides?.projects !== undefined ? overrides.projects : editedProjects;

      const payload: any = {
        name: nameToSave,
        title: roleToSave,
        headline: headlineToSave,
        about: aboutToSave,
        skills: skillsIntroToSave,
        phone: phoneToSave,
        professional_skills: skillsToSave,
        sectors: sectorsToSave,
        languages: languagesToSave,
        services: servicesRaw.map((s: any) => (typeof s === 'string' ? s : s.title)).filter(Boolean),
        education: educationsRaw.map((edu: any) => {
          const years = edu.years ? String(edu.years).split('-') : [];
          const startYear = parseYearNumber(years[0]);
          const endYear = parseYearNumber(years[1]);
          const item: any = {
            title: edu.title || '',
            name: edu.university || '',
          };
          if (startYear !== undefined) item.start_year = startYear;
          if (endYear !== undefined) item.end_year = endYear;
          return item;
        }),
        certifications: certsRaw.map((cert: any) => {
          const years = cert.years ? String(cert.years).split('-') : [];
          const startYear = parseYearNumber(years[0]);
          const endYear = parseYearNumber(years[1]);
          const item: any = {
            title: cert.title || '',
            name: cert.issuer || '',
          };
          if (startYear !== undefined) item.start_year = startYear;
          if (endYear !== undefined) item.end_year = endYear;
          return item;
        }),
        work_experience: expsRaw.map((exp: any) => {
          const startYear = parseYearNumber(exp.startDate);
          const endYear = exp.active ? undefined : parseYearNumber(exp.endDate);
          const item: any = {
            title: exp.title || '',
            name: exp.company || '',
            about: exp.description || '',
            isPresent: Boolean(exp.active),
          };
          if (startYear !== undefined) item.start_year = startYear;
          if (endYear !== undefined) item.end_year = endYear;
          return item;
        }),
        projects: projectsRaw.map((proj: any) => ({
          title: proj.title || '',
          name: proj.org || '',
          location: proj.location || '',
          projectType: proj.type || '',
          tags:
            typeof proj.tags === 'string'
              ? proj.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : (Array.isArray(proj.tags) ? proj.tags : []),
          details: proj.description || '',
          status: proj.status || 'Done',
        })),
      };

      if (avatarToSave) {
        payload.avatar = avatarToSave;
      }

      const res = await api.patch('/users/profile', payload);
      const updatedUser = res.data;
      if (updatedUser) {
        setLocalUserData(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      toast({
        variant: 'success',
        title: 'Profile Saved',
        description: 'Your changes have been saved to the backend successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMsg =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join(', ')
          : error.message) ||
        'Failed to save profile. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop as string, croppedAreaPixels as any, 0);
      setEditedProfilePic(croppedImage);
      setImageToCrop(null);
      await handleSaveProfile({ avatar: croppedImage });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to crop image.',
      });
    }
  };
  const tabs = [
    { name: "Short bio", icon: <FileText className="h-4 w-4" /> },
    { name: "Skills", icon: <Zap className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  ];

  if (isLoading || isLoadingProfile) {
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
                {editedProfilePic || localUserData?.avatar || user?.picture ? (
                  <img
                    src={editedProfilePic || localUserData?.avatar || user?.picture || ""}
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
                      <Button size="sm" onClick={() => { setIsEditing(false); handleSaveProfile({ name: editedName, title: editedRole }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
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
                      {editedRole || <span className="text-gray-400 italic font-normal text-sm">No title specified</span>}
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
                          <Button size="sm" onClick={() => { setIsEditingHeadline(false); handleSaveProfile({ headline: editedHeadline }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingHeadline(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {editedHeadline || (
                          <span className="text-gray-400 italic">No headline added yet. Click the edit icon to add a headline.</span>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingAbout(false); handleSaveProfile({ about: editedAbout }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingAbout(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 leading-relaxed">
                        {editedAbout || (
                          <span className="text-gray-400 italic">No about bio added yet. Click the edit icon to add your bio.</span>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingEducation(false); handleSaveProfile({ education: editedEducations }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingEducation(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editedEducations.length > 0 ? (
                          editedEducations.map((edu) => (
                            <div key={edu.id}>
                              <p className="font-semibold text-gray-900">{edu.title}</p>
                              <p className="text-gray-500 text-sm">{edu.university} {edu.university && edu.years && "•"} {edu.years}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">No education added yet. Click the edit icon to add education.</p>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingCertifications(false); handleSaveProfile({ certifications: editedCertifications }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingCertifications(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editedCertifications.length > 0 ? (
                          editedCertifications.map((cert) => (
                            <div key={cert.id}>
                              <p className="font-semibold text-gray-900">{cert.title}</p>
                              <p className="text-gray-500 text-sm">{cert.issuer} {cert.issuer && cert.years && "•"} {cert.years}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">No certifications added yet. Click the edit icon to add certifications.</p>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingExperience(false); handleSaveProfile({ work_experience: editedExperiences }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingExperience(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {editedExperiences.length > 0 ? (
                          editedExperiences.map((exp, idx, arr) => (
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
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">No work experience added yet. Click the edit icon to add experience.</p>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingSkillsIntro(false); handleSaveProfile({ skills: editedSkillsIntro }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingSkillsIntro(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 leading-relaxed mb-4 whitespace-pre-wrap">
                        {editedSkillsIntro || (
                          <span className="text-gray-400 italic">No skills overview provided yet. Click the edit icon to add an overview.</span>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingSkills(false); handleSaveProfile({ professional_skills: editedSkills }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsEditingSkills(false);
                            setNewSkillInput("");
                          }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {editedSkills.length > 0 ? (
                          editedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">No professional skills added yet. Click the edit icon to add skills.</p>
                        )}
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
                          <Button size="sm" onClick={() => { setIsEditingServices(false); handleSaveProfile({ services: editedServices }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsEditingServices(false);
                            setNewServiceInput("");
                          }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editedServices.length > 0 ? (
                          editedServices.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/30 transition-all group"
                            >
                              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                {service.icon || <Leaf className="h-4 w-4" />}
                              </div>
                              <span className="text-gray-700 text-sm font-medium">
                                {service.title}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic col-span-2">No services added yet. Click the edit icon to add services.</p>
                        )}
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
                        <Button size="sm" onClick={() => { setIsEditingProjects(false); handleSaveProfile({ projects: editedProjects }); }} className="bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
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
                  
                  {editedProjects.length === 0 && !isEditingProjects && (
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                      <p className="text-gray-400 text-sm italic mb-3">No projects added yet.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingProjects(true);
                          setEditedProjects([
                            {
                              id: Date.now(),
                              icon: <Leaf className="h-6 w-6 text-white" />,
                              iconBg: "bg-green-500",
                              org: "",
                              location: "",
                              tags: "",
                              title: "",
                              type: "",
                              time: "",
                              description: "",
                              status: "Done",
                            }
                          ]);
                        }}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        + Add your first project
                      </Button>
                    </div>
                  )}

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
                              {(typeof project.tags === "string" ? project.tags.split(",") : (Array.isArray(project.tags) ? project.tags : [])).map((tag: any) => String(tag).trim()).filter(Boolean).map((tag: string) => (
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
                        <Button size="sm" onClick={() => { setIsEditingSectors(false); handleSaveProfile({ sectors: editedSectors }); }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingSectors(false); setNewSectorInput(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {editedSectors.length > 0 ? (
                        editedSectors.map((sector, idx) => {
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
                        })
                      ) : (
                        <span className="text-gray-400 text-xs italic">None specified</span>
                      )}
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
                        <Button size="sm" onClick={() => { setIsEditingLanguage(false); handleSaveProfile({ languages: editedLanguages }); }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingLanguage(false); setNewLanguageInput(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-bold">{editedLanguages.length > 0 ? editedLanguages.join(", ") : <span className="text-gray-400 font-normal text-xs italic">None specified</span>}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Education Level</p>
                  <p className="text-gray-900 font-bold">{editedEducations[0]?.title || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-gray-900 font-bold">{localUserData?.email || user?.email || "Not available"}</p>
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
                            handleSaveProfile({ phone: editedPhone });
                          }
                        }} className="h-auto py-1 px-2 text-xs bg-[#00B660] hover:bg-[#00a355] text-white">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsEditingPhone(false); setPhoneError(""); }} className="h-auto py-1 px-2 text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-bold">{editedPhone || <span className="text-gray-400 font-normal text-xs italic">Not provided</span>}</p>
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
