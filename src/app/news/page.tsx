"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import api from "@/utils/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Calendar,
  User,
  ExternalLink,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  X,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiNewsItem {
  _id: string;
  id?: number;
  title: string;
  description?: string;
  summary?: string;
  content?: string;
  category?: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  author?: string;
  source_name?: string;
  url?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  youtubeId?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface NewsApiResponse {
  data: ApiNewsItem[];
  pagination: PaginationInfo;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
  readTime: string;
  author: string;
  category: string;
  rawDate: string;
  link?: string;
  youtubeId?: string;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=800",
];

const sampleAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
];

const POPULAR_CATEGORIES = [
  { label: "All Categories", value: "all" },
  { label: "Development Finance", value: "Development Finance" },
  { label: "Environment", value: "Environment" },
  { label: "Climate Change", value: "Climate" },
  { label: "Agriculture", value: "Agriculture" },
  { label: "Conservation", value: "Conservation" },
  { label: "Health", value: "Health" },
  { label: "Urban Policy", value: "Urban" },
  { label: "Carbon Accounting", value: "Carbon Accounting" },
  { label: "Water", value: "Water" },
  { label: "Technology", value: "Technology" },
];

function formatPublishDate(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function calculateReadTime(text?: string): string {
  if (!text) return "3 mins read";
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(2, Math.ceil(words / 45));
  return `${mins} min read`;
}

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function NewsPage() {
  // Pagination & Filtering state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Data state
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Detail & Stories states
  const [currentView, setCurrentView] = useState<{
    page: "home" | "article";
    articleId: string | null;
  }>({
    page: "home",
    articleId: null,
  });

  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isStoryPaused, setIsStoryPaused] = useState<boolean>(false);
  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState<string | null>(null);

  // Jump to page input
  const [jumpPageInput, setJumpPageInput] = useState<string>("");

  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const feedTopRef = useRef<HTMLDivElement | null>(null);
  const storyDuration = 5000;
  const updateInterval = 50;

  // Fetch news data using page & limit pagination
  const fetchNews = useCallback(
    async (targetPage: number, targetCategory: string, queryText: string, targetLimit: number) => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = {
          page: targetPage,
          limit: targetLimit,
        };

        if (targetCategory && targetCategory !== "all") {
          params.category = targetCategory;
        }

        if (queryText.trim()) {
          params.search = queryText.trim();
        }

        const response = await api.get<NewsApiResponse>("/news", { params });
        const responseData = response.data;
        const rawItems = responseData?.data || [];

        const paginationData: PaginationInfo = responseData?.pagination || {
          total: rawItems.length,
          page: targetPage,
          limit: targetLimit,
          pages: Math.max(1, Math.ceil(rawItems.length / targetLimit)),
          hasNext: false,
          hasPrev: false,
        };

        const formattedArticles: NewsArticle[] = rawItems.map((item, idx) => {
          const excerptText = item.description || item.summary || item.content || "";
          let categoryDisplay = item.category || "Sustainability";
          if (categoryDisplay.length > 30) {
            categoryDisplay = categoryDisplay.split(",")[0].trim();
          }

          const fallback = FALLBACK_IMAGES[(idx + (targetPage - 1) * targetLimit) % FALLBACK_IMAGES.length];
          const rawImg = item.image || item.image_url || item.imageUrl;
          const imageUrl = rawImg && rawImg.startsWith("http") ? rawImg : fallback;

          return {
            id: item._id,
            title: item.title || "Untitled Article",
            excerpt: excerptText,
            content: item.content || item.description || item.summary || "",
            imageUrl,
            publishedDate: formatPublishDate(item.createdAt || item.date || item.updatedAt),
            readTime: calculateReadTime(excerptText),
            author: item.author || item.source_name || "Enviro Editorial",
            category: categoryDisplay,
            rawDate: item.createdAt || item.date || "",
            link: item.link || item.url,
            youtubeId: item.youtubeId,
          };
        });

        setArticles(formattedArticles);
        setPagination(paginationData);
      } catch (err: any) {
        console.error("Failed to fetch news:", err);
        setError(err?.formattedMessage || err?.message || "Unable to connect to news server.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchNews(currentPage, selectedCategory, activeSearch, pageSize);
  }, [fetchNews, currentPage, selectedCategory, activeSearch, pageSize]);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (!pagination || newPage < 1 || newPage > pagination.pages || newPage === currentPage) return;
    setCurrentPage(newPage);
    feedTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchKeyword);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryVal: string) => {
    setSelectedCategory(categoryVal);
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setSearchKeyword("");
    setActiveSearch("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const handleJumpPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && pagination && target >= 1 && target <= pagination.pages) {
      handlePageChange(target);
      setJumpPageInput("");
    }
  };

  // Top highlight stories tray data
  const storiesData = useMemo(() => {
    if (articles.length === 0) return [];
    return articles.slice(0, 8).map((art, idx) => ({
      id: art.id,
      title: art.title,
      category: art.category,
      imageUrl: art.imageUrl,
      source: art.author,
      avatar: sampleAvatars[idx % sampleAvatars.length],
    }));
  }, [articles]);

  // Story Progress Timer
  useEffect(() => {
    if (!isStoryViewerOpen || isStoryPaused || storiesData.length === 0) {
      if (progressTimer.current) clearInterval(progressTimer.current);
      return;
    }

    progressTimer.current = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + (updateInterval / storyDuration) * 100;
      });
    }, updateInterval);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
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

  const activeArticle = useMemo(() => {
    if (currentView.page === "article" && currentView.articleId) {
      return articles.find((art) => art.id === currentView.articleId) || articles[0] || null;
    }
    return null;
  }, [currentView, articles]);

  const totalArticles = pagination?.total || 0;
  const totalPages = pagination?.pages || 1;
  const startItem = totalArticles === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalArticles);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 max-w-7xl">
        {/* HEADER SECTION */}
        <div ref={feedTopRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#315D40]">
                Live Sustainability Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sustainability & ESG Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated articles, policy updates, and ESG reports from global sustainability leaders.
            </p>
          </div>

          {pagination && (
            <div className="flex items-center gap-3 self-start md:self-auto bg-white border border-slate-200/80 rounded-2xl px-4 py-2 shadow-2xs">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Articles</p>
                <p className="text-base font-extrabold text-[#315D40]">{totalArticles.toLocaleString()}</p>
              </div>
              <div className="h-7 w-[1px] bg-slate-200" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Page</p>
                <p className="text-base font-extrabold text-slate-800">
                  {currentPage} <span className="text-xs text-slate-400 font-normal">/ {totalPages}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MAIN FEED VIEW */}
        {currentView.page === "home" && (
          <div className="space-y-8">
            {/* STORIES TRAY */}
            {storiesData.length > 0 && !activeSearch && selectedCategory === "all" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Featured Highlights
                  </h2>
                  <span className="text-[11px] text-slate-400">Tap to watch stories</span>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {storiesData.map((story, index) => (
                    <button
                      key={story.id}
                      onClick={() => launchStory(index)}
                      className="relative w-32 sm:w-36 h-48 sm:h-52 rounded-2xl overflow-hidden group shrink-0 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
                      <div className="absolute top-3 left-3 p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full z-20">
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white">
                          <img src={story.avatar} alt={story.source} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="absolute inset-x-3 bottom-3 text-left z-20">
                        <span className="block text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-0.5 truncate">
                          {story.category}
                        </span>
                        <p className="text-white text-xs font-bold leading-snug line-clamp-2">
                          {story.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* SEARCH AND FILTERS BAR */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search articles by title, keywords, or topics..."
                    className="pl-10 pr-20 h-10 rounded-xl bg-slate-50/70 border-slate-200 focus-visible:ring-emerald-500 text-sm"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchKeyword && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      className="h-7 px-3 bg-[#315D40] hover:bg-[#254A32] text-white text-xs rounded-lg"
                    >
                      Search
                    </Button>
                  </div>
                </form>

                {/* Per Page Select */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500 font-medium">Show:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => {
                      setPageSize(Number(val));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[85px] h-10 rounded-xl bg-slate-50/70 border-slate-200 text-xs font-semibold">
                      <SelectValue placeholder="12" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 / page</SelectItem>
                      <SelectItem value="24">24 / page</SelectItem>
                      <SelectItem value="36">36 / page</SelectItem>
                      <SelectItem value="48">48 / page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Categories:
                </span>
                {POPULAR_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#315D40] text-white shadow-2xs"
                          : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Filter Indicators */}
              {(activeSearch || selectedCategory !== "all") && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Filtering by:</span>
                    {activeSearch && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#315D40] font-medium px-2.5 py-0.5 rounded-md border border-emerald-100">
                        Search: "{activeSearch}"
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-emerald-900"
                          onClick={handleClearSearch}
                        />
                      </span>
                    )}
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#315D40] font-medium px-2.5 py-0.5 rounded-md border border-emerald-100">
                        Category: {selectedCategory}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-emerald-900"
                          onClick={() => handleCategorySelect("all")}
                        />
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleResetAll}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS COUNTER & SUMMARY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              {loading ? (
                <span>Loading articles...</span>
              ) : (
                <span>
                  Showing <strong className="text-slate-800">{startItem}</strong> to{" "}
                  <strong className="text-slate-800">{endItem}</strong> of{" "}
                  <strong className="text-slate-800">{totalArticles.toLocaleString()}</strong> news articles
                </span>
              )}
              {totalPages > 1 && !loading && (
                <span className="text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 text-sm">Failed to load news</h3>
                  <p className="text-xs text-red-600 mt-1 max-w-md mx-auto">{error}</p>
                </div>
                <Button
                  onClick={() => fetchNews(currentPage, selectedCategory, activeSearch, pageSize)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs"
                >
                  Retry Connection
                </Button>
              </div>
            )}

            {/* LOADING SKELETON */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: pageSize > 12 ? 12 : pageSize }).map((_, n) => (
                  <div
                    key={n}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs animate-pulse"
                  >
                    <div className="aspect-video bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                      <div className="h-5 bg-slate-200 rounded w-5/6" />
                      <div className="h-3.5 bg-slate-100 rounded w-full" />
                      <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                      <div className="pt-3 border-t border-slate-50 flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && articles.length === 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">No news articles found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    We couldn't find any news articles matching your current filter criteria. Try adjusting your
                    keywords or resetting the category filter.
                  </p>
                </div>
                <Button
                  onClick={handleResetAll}
                  className="bg-[#315D40] hover:bg-[#254A32] text-white text-xs rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* ARTICLES GRID */}
            {!loading && !error && articles.length > 0 && (
              <section className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((item, idx) => (
                    <article
                      key={item.id}
                      onClick={() => {
                        if (item.youtubeId) {
                          setActiveYoutubeVideo(item.youtubeId);
                        } else {
                          setCurrentView({ page: "article", articleId: item.id });
                        }
                      }}
                      className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                            }}
                          />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#315D40] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs tracking-wider uppercase max-w-[80%] truncate">
                            {item.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> {item.publishedDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> {item.readTime}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#315D40] transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>

                          {item.excerpt && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {item.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-5 pt-0">
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] truncate max-w-[180px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            {item.author}
                          </span>
                          <span className="text-xs font-bold text-[#315D40] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Read article <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{" "}
                      <strong>{totalArticles.toLocaleString()}</strong> articles
                    </div>

                    {/* Numbered Pagination Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 px-2.5 rounded-lg text-slate-600 border-slate-200 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4 mr-0.5" /> Prev
                      </Button>

                      {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400">
                              ...
                            </span>
                          );
                        }

                        const pageNum = p as number;
                        const isCurrent = pageNum === currentPage;

                        return (
                          <Button
                            key={`page-${pageNum}`}
                            variant={isCurrent ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold ${
                              isCurrent
                                ? "bg-[#315D40] hover:bg-[#254A32] text-white shadow-2xs"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 px-2.5 rounded-lg text-slate-600 border-slate-200 disabled:opacity-40"
                      >
                        Next <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Button>
                    </div>

                    {/* Quick Jump Input for Large Page Counts */}
                    <form onSubmit={handleJumpPageSubmit} className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-slate-400">Go to:</span>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={jumpPageInput}
                        onChange={(e) => setJumpPageInput(e.target.value)}
                        placeholder={currentPage.toString()}
                        className="w-16 h-8 text-xs text-center rounded-lg border-slate-200 bg-slate-50"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs text-[#315D40] hover:bg-emerald-50 rounded-lg font-bold"
                      >
                        Go
                      </Button>
                    </form>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* EDITORIAL DETAIL VIEW */}
        {currentView.page === "article" && activeArticle && (
          <div className="space-y-8 max-w-4xl mx-auto py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentView({ page: "home", articleId: null });
                  feedTopRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#315D40] transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
              >
                ← Back to News Feed
              </button>

              <div className="flex items-center gap-2">
                {activeArticle.link && (
                  <a
                    href={activeArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#315D40] hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60 transition-colors"
                  >
                    View Original Source <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <article className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-extrabold tracking-widest text-[#315D40] bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100">
                  {activeArticle.category}
                </span>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs pt-3 border-t border-slate-100">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> By {activeArticle.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Published {activeArticle.publishedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}
                  </span>
                </div>
              </div>

              {activeArticle.imageUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xs">
                  <img
                    src={activeArticle.imageUrl}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0];
                    }}
                  />
                </div>
              )}

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 pt-2">
                {activeArticle.excerpt && (
                  <p className="text-base sm:text-lg text-slate-900 font-medium italic border-l-4 border-emerald-600 pl-4 bg-emerald-50/40 py-4 rounded-r-xl">
                    "{activeArticle.excerpt}"
                  </p>
                )}

                {activeArticle.content && activeArticle.content !== activeArticle.excerpt && (
                  <p className="whitespace-pre-line">{activeArticle.content}</p>
                )}

                <p>
                  As global standards in environmental, social, and governance (ESG) compliance continue to evolve, staying updated with regulatory adjustments across key markets is critical for operational excellence and long-term sustainability impact.
                </p>

                <p>
                  Industry leaders recommend establishing continuous auditing practices to evaluate supply chain inputs, material traceability, and regulatory updates in climate policy, carbon accounting, and resource conservation.
                </p>

                {activeArticle.link && (
                  <div className="pt-6 border-t border-slate-100">
                    <a
                      href={activeArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#315D40] hover:bg-[#254A32] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Read Complete Article at Source <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </article>
          </div>
        )}
      </div>

      {/* FULL SCREEN STORY OVERLAY */}
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
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0];
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10 pointer-events-none" />

            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={storiesData[activeStoryIdx]?.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold truncate max-w-[200px]">
                    {storiesData[activeStoryIdx]?.source}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block truncate max-w-[200px]">
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
              <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md line-clamp-3">
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

      {/* YOUTUBE LIGHTBOX */}
      {activeYoutubeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <button
              onClick={() => setActiveYoutubeVideo(null)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white font-bold flex items-center justify-center transition-colors shadow-md z-50 border border-white/10 cursor-pointer"
            >
              ✕
            </button>

            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activeYoutubeVideo}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
