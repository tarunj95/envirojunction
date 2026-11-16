"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { calculateProfileCompletion } from "@/utils/profile";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Phone,
  FileText,
  BadgeCheck,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const FolderIcon = () => (
  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  </div>
);

const FistIcon = () => (
  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
);

const TargetIcon = () => (
  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const HiringIllustration = () => (
  <svg viewBox="0 0 240 140" className="w-full h-32 mx-auto my-3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="70" r="55" fill="#E8F5E9" opacity="0.6" />
    <rect x="30" y="90" width="180" height="4" rx="2" fill="#A5D6A7" opacity="0.4" />
    <g transform="translate(45, 15)">
      <path d="M25 65 L45 65 L40 100 L15 100 Z" fill="#3F51B5" />
      <rect x="22" y="55" width="16" height="12" rx="4" fill="#FFE082" />
      <path d="M8 45 L35 55 L33 60 L6 50 Z" fill="#37474F" />
      <circle cx="28" cy="48" r="3" fill="#FFF" />
      <circle cx="32" cy="42" r="10" fill="#FFE082" />
      <path d="M22 38 Q32 28 42 38 Q32 34 22 38 Z" fill="#212121" />
      <path d="M22 60 L12 50 L14 47 L24 57 Z" fill="#FFE082" />
    </g>
    <g transform="translate(130, 20)">
      <path d="M20 60 L45 60 L40 95 L15 95 Z" fill="#00C853" />
      <rect x="18" y="50" width="20" height="12" fill="#FFCC80" />
      <rect x="32" y="55" width="22" height="28" rx="2" fill="#D7CCC8" transform="rotate(-5)" />
      <rect x="36" y="60" width="14" height="18" fill="#FFF" transform="rotate(-5)" />
      <circle cx="28" cy="35" r="10" fill="#FFCC80" />
      <path d="M20 30 Q28 20 36 30" fill="#3E2723" />
      <rect x="26" y="32" width="10" height="4" rx="1" fill="#37474F" opacity="0.8" />
    </g>
    <path d="M110 30 L112 34 L116 34 L113 37 L115 41 L110 39 L105 41 L107 37 L104 34 L108 34 Z" fill="#FFD54F" />
    <path d="M190 45 L191 47 L193 47 L191 49 L192 51 L190 50 L188 51 L189 49 L187 47 L189 47 Z" fill="#FFD54F" />
  </svg>
);

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Profile completion gate state
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileScore, setProfileScore] = useState<number>(0);

  // Home page feed & UI state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [hiringFormSubmitted, setHiringFormSubmitted] = useState(false);

  // Stories state
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000;
  const updateInterval = 50;

  // Feed states
  const [page, setPage] = useState(1);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [newsOnly, setNewsOnly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Step 1: Check authentication & calculate profile completion (> 70% requirement)
  useEffect(() => {
    const verifyProfileAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserStr = localStorage.getItem("user");

        if (!token && !storedUserStr) {
          router.push("/signin");
          return;
        }

        // Try local storage profile first for instant UI response
        let initialProfile: any = null;
        if (storedUserStr) {
          try {
            initialProfile = JSON.parse(storedUserStr);
            const initialScore = calculateProfileCompletion(initialProfile);
            setUserProfile(initialProfile);
            setProfileScore(initialScore);
          } catch (_) {}
        }

        // Fetch fresh profile data from backend to ensure accuracy
        try {
          const profileRes = await api.get("/users/profile");
          const freshProfile = profileRes.data?.data || profileRes.data || initialProfile;
          if (freshProfile) {
            const calculated = calculateProfileCompletion(freshProfile);
            setUserProfile(freshProfile);
            setProfileScore(calculated);
          }
        } catch (apiErr) {
          console.warn("Could not fetch remote profile, using local:", apiErr);
        }
      } catch (err) {
        console.error("Profile check failed:", err);
      } finally {
        setCheckingProfile(false);
      }
    };

    verifyProfileAccess();
  }, [router]);

  // Step 2: Fetch feed items when profile is verified to be > 70%
  const fetchPage = useCallback(async (targetPage: number) => {
    if (targetPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const [newsRes, jobsRes] = await Promise.all([
        api.get("/news", { params: { page: targetPage, limit: 6 } }).catch(() => null),
        api.get("/jobs", { params: { page: targetPage, limit: 6 } }).catch(() => null),
      ]);

      const newsData = newsRes?.data ? newsRes.data : { data: [], pagination: { hasNext: false } };
      const jobsData = jobsRes?.data ? jobsRes.data : { data: [], pagination: { pages: 1 } };

      const newsItems = (newsData.data || []).map((n: any) => ({
        ...n,
        feedType: "news",
        sortDate: new Date(n.createdAt || Date.now()).getTime(),
      }));

      const jobsItems = (jobsData.data || []).map((j: any) => ({
        ...j,
        feedType: "job",
        sortDate: new Date(j.date_posted || j.createdAt || Date.now()).getTime(),
      }));

      const combined = [...newsItems, ...jobsItems].sort((a, b) => b.sortDate - a.sortDate);

      setNewsOnly((prev) => {
        const newUnique = newsItems.filter((n: any) => !prev.some((p) => p._id === n._id));
        return [...prev, ...newUnique];
      });

      setFeedItems((prev) => {
        if (targetPage === 1) return combined;
        const existingIds = new Set(prev.map((p) => p._id));
        const newUnique = combined.filter((c: any) => !existingIds.has(c._id));
        return [...prev, ...newUnique];
      });

      const newsHasNext = newsData.pagination?.hasNext;
      const jobsHasNext = targetPage < (jobsData.pagination?.pages || 1);

      setHasNextPage(Boolean(newsHasNext || jobsHasNext));
    } catch (err) {
      console.error("Home feed fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingProfile && profileScore > 70) {
      fetchPage(1);
    }
  }, [checkingProfile, profileScore, fetchPage]);

  const loadNextPage = useCallback(() => {
    if (!loading && !loadingMore && hasNextPage) {
      const nextP = page + 1;
      setPage(nextP);
      fetchPage(nextP);
    }
  }, [loading, loadingMore, hasNextPage, page, fetchPage]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading && !loadingMore) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, loading, loadingMore, loadNextPage]);

  // Stories
  const storiesData = useMemo(() => {
    if (newsOnly.length === 0) return [];
    return newsOnly.slice(0, 10).map((art) => ({
      id: art._id,
      title: art.title,
      category: art.category || "Sustainability",
      imageUrl: art.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      source: art.author || "Enviro Junction",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    }));
  }, [newsOnly]);

  // Trending Now
  const trendingNow = useMemo(() => {
    return feedItems.slice(0, 5).map((item, idx) => {
      const isNews = item.feedType === "news";
      const iconTypes = ["folder", "fist", "target"];
      return {
        id: item._id,
        iconType: iconTypes[idx % 3],
        title: item.title,
        source: isNews ? item.author || "Editorial" : item.organisation || "Company",
        date: new Date(item.sortDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        url: isNews ? "/news" : `/jobs/${item._id}`,
      };
    });
  }, [feedItems]);

  // Gallery
  const defaultImages = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=150",
  ];

  const galleryImages = useMemo(() => {
    const fromNews = newsOnly.filter((n) => n.image).map((n) => n.image);
    const combined = [...fromNews, ...defaultImages];
    return combined.slice(0, 9);
  }, [newsOnly]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return feedItems;
    const query = searchQuery.toLowerCase();
    return feedItems.filter(
      (item) =>
        (item.title?.toLowerCase() || "").includes(query) ||
        (item.description?.toLowerCase() || "").includes(query) ||
        (item.author?.toLowerCase() || item.organisation?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery, feedItems]);

  useEffect(() => {
    if (!isStoryViewerOpen || isStoryPaused || storiesData.length === 0) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    progressTimerRef.current = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + (updateInterval / storyDuration) * 100;
      });
    }, updateInterval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isStoryViewerOpen, activeStoryIdx, isStoryPaused, storiesData]);

  const handleNextStory = () => {
    setStoryProgress(0);
    if (activeStoryIdx < storiesData.length - 1) {
      setActiveStoryIdx((prev) => prev + 1);
    } else {
      setIsStoryViewerOpen(false);
    }
  };

  const handlePrevStory = () => {
    setStoryProgress(0);
    if (activeStoryIdx > 0) {
      setActiveStoryIdx((prev) => prev - 1);
    }
  };

  const launchStory = (index: number) => {
    setActiveStoryIdx(index);
    setStoryProgress(0);
    setIsStoryViewerOpen(true);
    setIsStoryPaused(false);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <FolderIcon />;
      case "fist":
        return <FistIcon />;
      case "target":
        return <TargetIcon />;
      default:
        return null;
    }
  };

  const handleHiringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHiringFormSubmitted(true);
    setTimeout(() => {
      setHiringFormSubmitted(false);
      setShowHiringModal(false);
    }, 2000);
  };

  // CHECKING STATE SKELETON
  if (checkingProfile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-10 h-10 border-3 border-[#315D40] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Verifying profile access...</p>
      </div>
    );
  }

  // PROFILE INCOMPLETE GATE (Profile must be > 70% to view Home)
  if (profileScore <= 70) {
    const hasName = Boolean(userProfile?.name?.trim());
    const hasTitle = Boolean((userProfile?.title || userProfile?.role)?.trim());
    const hasHeadline = Boolean(userProfile?.headline?.trim());
    const hasAbout = Boolean((userProfile?.about || userProfile?.bio)?.trim());
    const hasPhone = Boolean(userProfile?.phone?.trim());
    const skillsList = userProfile?.professional_skills || (Array.isArray(userProfile?.skills) ? userProfile?.skills : (userProfile?.skills ? [userProfile?.skills] : []));
    const hasSkills = Boolean(Array.isArray(skillsList) && skillsList.length > 0);
    const hasExps = Boolean(Array.isArray(userProfile?.work_experience || userProfile?.experiences) && (userProfile?.work_experience || userProfile?.experiences).length > 0);
    const hasEdus = Boolean(Array.isArray(userProfile?.education || userProfile?.educations) && (userProfile?.education || userProfile?.educations).length > 0);

    const checklist = [
      { label: "Full Name", weight: 10, done: hasName, icon: User },
      { label: "Job Title / Role", weight: 10, done: hasTitle, icon: Briefcase },
      { label: "Professional Headline", weight: 15, done: hasHeadline, icon: BadgeCheck },
      { label: "About / Bio Summary", weight: 15, done: hasAbout, icon: FileText },
      { label: "Phone Number", weight: 10, done: hasPhone, icon: Phone },
      { label: "Professional Skills", weight: 15, done: hasSkills, icon: Sparkles },
      { label: "Work Experience", weight: 15, done: hasExps, icon: Briefcase },
      { label: "Education & Degree", weight: 10, done: hasEdus, icon: GraduationCap },
    ];

    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60 shadow-2xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Complete Profile to Unlock Home
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              To maintain an authentic and qualified sustainability network, you can access the Home stream once your profile is <strong>more than 70% complete</strong>.
            </p>
          </div>

          {/* Progress Bar Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 uppercase tracking-wider text-[11px]">Current Completion</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${profileScore > 50 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                {profileScore}% / 100%
              </span>
            </div>

            {/* Visual Bar */}
            <div className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#315D40] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${profileScore}%` }}
              />
              {/* 70% Goal Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
                style={{ left: "70%" }}
                title="70% Unlock Threshold"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium pt-1">
              <span>0%</span>
              <span className="text-[#315D40] font-bold">🎯 70% Required to Unlock</span>
              <span>100%</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Profile Sections Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {checklist.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      item.done
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${item.done ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.done ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +{item.weight}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        +{item.weight}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link href="/profile" className="w-full block">
              <Button className="w-full h-11 bg-[#315D40] hover:bg-[#254A32] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                Complete Your Profile Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PROFILE COMPLETE (> 70%): SHOW FULL HOME STREAM
  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20 bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 w-full">
        {/* STORIES TRAY */}
        {storiesData.length > 0 && (
          <section className="py-1 w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none w-full">
              {storiesData.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => launchStory(index)}
                  className="relative w-32 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden group shrink-0 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none bg-slate-900 cursor-pointer"
                >
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />
                  <div className="absolute top-3 left-3 p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full z-20">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img src={story.avatar} alt={story.source} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 text-left z-20">
                    <span className="block text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-0.5 truncate">
                      {story.category}
                    </span>
                    <p className="text-white text-xs font-bold leading-snug line-clamp-2">{story.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* FEED SEARCH & STREAM BAR */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search feed articles, jobs, sustainability updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-xl pl-9 pr-8 h-10 text-sm focus-visible:ring-[#315D40]"
            />
            {searchQuery && (
              <X 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* BOTTOM LAYOUT: LATEST ARTICLES FEED & SIDEBAR */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          {/* LEFT COLUMN: LATEST POSTS FEED */}
          <section className="flex-1 min-w-0 w-full space-y-8">
            {filteredItems.length === 0 && !loading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No posts found matching your search term.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 text-xs font-semibold bg-[#315D40] text-white rounded-full hover:bg-emerald-800 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredItems.map((item) => {
                  const isNews = item.feedType === "news";
                  const imageUrl = isNews
                    ? item.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
                    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600";

                  const category = isNews ? item.category || "News" : item.job_type || item.type || "Job";
                  const title = item.title;
                  const description = item.description || "";
                  const author = isNews ? item.author || "Editorial" : item.company || item.organisation || "Company";
                  const authorColor = isNews ? "bg-indigo-600" : "bg-emerald-600";
                  const date = new Date(item.sortDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const readTime = isNews ? "5 mins read" : item.location || "Remote";

                  return (
                    <Link href={isNews ? "/news" : `/jobs/${item._id}`} key={item._id} className="block h-full">
                      <article className="group h-full flex flex-col bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600";
                            }}
                          />
                          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs text-[#315D40] uppercase tracking-widest">
                            {isNews ? "NEWS" : "JOB"}
                          </span>
                        </div>

                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <span className="inline-block text-[11px] font-bold tracking-wider text-[#315D40] uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full truncate max-w-[85%]">
                              {category}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#315D40] transition-colors line-clamp-2">
                              {title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">{description}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] font-semibold text-gray-600">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-full ${authorColor} flex items-center justify-center text-white text-[9px] shrink-0`}
                              >
                                {isNews ? "📝" : "🏢"}
                              </span>
                              <span className="truncate max-w-[90px] sm:max-w-[110px]">{author}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 shrink-0 text-[10px] sm:text-[11px]">
                              <span>{date}</span>
                              <span>•</span>
                              <span className="truncate max-w-[70px] sm:max-w-[90px]">{readTime}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Loading & Infinite Scroll Target */}
            <div ref={observerTarget} className="py-8 flex justify-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-[#315D40] font-semibold text-sm">
                  <span className="w-5 h-5 border-2 border-[#315D40] border-t-transparent rounded-full animate-spin"></span>
                  Loading more items...
                </div>
              )}
              {!hasNextPage && filteredItems.length > 0 && !loading && (
                <div className="text-gray-400 text-sm font-medium">You have reached the end of the feed.</div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 space-y-6 lg:sticky lg:top-24 self-start">
            {/* Trending Now Widget */}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Trending Now</h3>
              <div className="space-y-4">
                {trendingNow.map((item) => (
                  <Link href={item.url} key={item.id} className="flex gap-4 group cursor-pointer">
                    <div className="shrink-0">{renderIcon(item.iconType)}</div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#315D40] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {item.source} • {item.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Premium Interactive Hiring Box */}
            <div className="p-6 bg-[#E8F5E9]/80 border border-emerald-100 rounded-[2rem] relative overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-emerald-800 text-xs font-extrabold tracking-widest block uppercase">
                  HIRING?
                </span>
                <p className="mt-2 text-sm font-semibold text-emerald-950 leading-snug max-w-xs">
                  Contact us and we will help you choose the best candidate
                </p>
              </div>

              <HiringIllustration />

              <button
                onClick={() => setShowHiringModal(true)}
                className="w-full bg-[#315D40] hover:bg-[#254A32] text-white font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-2xl transition duration-300 shadow-xs hover:shadow-md mt-2 cursor-pointer"
              >
                Know More
              </button>
            </div>

            {/* Gallery Section */}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((src, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* STORIES LIGHTBOX */}
      {isStoryViewerOpen && storiesData.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center select-none"
          onMouseDown={() => setIsStoryPaused(true)}
          onMouseUp={() => setIsStoryPaused(false)}
          onTouchStart={() => setIsStoryPaused(true)}
          onTouchEnd={() => setIsStoryPaused(false)}
        >
          <div className="absolute top-4 inset-x-0 max-w-lg mx-auto px-4 z-50 flex gap-1.5">
            {storiesData.map((_, index) => {
              let width = "0%";
              if (index < activeStoryIdx) width = "100%";
              if (index === activeStoryIdx) width = `${storyProgress}%`;
              return (
                <div key={index} className="h-1 bg-white/25 rounded-full flex-1 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-75 ease-linear"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          <div className="relative w-full max-w-lg h-full max-h-screen md:h-[85vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between">
            <img
              src={storiesData[activeStoryIdx]?.imageUrl}
              alt={storiesData[activeStoryIdx]?.title}
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10 pointer-events-none" />

            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={storiesData[activeStoryIdx]?.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">{storiesData[activeStoryIdx]?.source}</h4>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                    {storiesData[activeStoryIdx]?.category}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStoryViewerOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center font-bold text-sm border border-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="absolute inset-y-0 inset-x-0 z-15 flex pointer-events-auto">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevStory();
                }}
                className="w-1/3 h-full cursor-w-resize"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStory();
                }}
                className="w-2/3 h-full cursor-e-resize"
              />
            </div>

            <div className="relative z-20 p-8 space-y-4 pointer-events-none">
              <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {storiesData[activeStoryIdx]?.title}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-white/50 font-medium border-t border-white/10 pt-4">
                <span>Hold to pause</span>
                <span className="text-emerald-400 font-bold">TAP RIGHT TO SKIP →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HIRING MODAL */}
      {showHiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowHiringModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                HIRING SOLUTIONS
              </span>
              <h3 className="text-xl font-extrabold text-gray-900">Let Us Handpick Candidates</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Submit your contact details and we'll match sustainable workforce experts to your green project scope right away.
              </p>

              {hiringFormSubmitted ? (
                <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
                  <p className="text-sm font-bold">🎉 Success!</p>
                  <p className="text-xs">We will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleHiringSubmit} className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">BUSINESS EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">PROJECT DETAILS</label>
                    <textarea
                      rows={3}
                      placeholder="I'm looking for high-quality sustainable packaging developers..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#315D40] hover:bg-[#254A32] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors mt-2 cursor-pointer"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading home...</div>}>
      <HomeContent />
    </Suspense>
  );
}
