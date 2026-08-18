"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface ApiNewsItem {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  author?: string;
  createdAt: string;
  updatedAt?: string;
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
  type: 'article' | 'youtube';
  aspectRatio: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedDate: string;
  readTime: string;
  author: string;
  category: string;
  rawDate: string;
  youtubeId?: string;
  sourceChannel?: string;
  thumbnailUrl?: string;
}

// Sample avatars for visual polish in top stories tray
const sampleAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
];

const aspectRatios = ['aspect-video', 'aspect-[4/3]', 'aspect-square', 'aspect-[16/10]'];

export default function NewsPage() {
  const [page, setPage] = useState<number>(1);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<{ page: 'home' | 'article'; articleId: string | null }>({
    page: 'home',
    articleId: null,
  });
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isStoryPaused, setIsStoryPaused] = useState<boolean>(false);
  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState<string | null>(null);

  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const storyDuration = 5000;
  const updateInterval = 50;

  // Fetch news articles (appends on page 2, 3, 4...) dynamically driven by API pagination
  const fetchNewsPage = useCallback(async (targetPage: number, overrideLimit?: number) => {
    if (targetPage === 1) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const url = overrideLimit
        ? `/api/news?page=${targetPage}&limit=${overrideLimit}`
        : `/api/news?page=${targetPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load news (status ${response.status})`);
      }
      const responseData: NewsApiResponse = await response.json();

      const rawItems = responseData?.data || [];
      const paginationData = responseData?.pagination || {
        total: rawItems.length,
        page: targetPage,
        limit: overrideLimit || rawItems.length || 5,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      };

      const currentLimit = paginationData.limit || 5;

      const formattedArticles: NewsArticle[] = rawItems.map((item, idx) => {
        let formattedDate = 'Recently';
        if (item.createdAt) {
          try {
            const dateObj = new Date(item.createdAt);
            formattedDate = dateObj.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
          } catch {
            formattedDate = item.createdAt;
          }
        }

        const words = (item.description || '').split(' ').length;
        const readMins = Math.max(3, Math.ceil(words / 40));

        let categoryDisplay = item.category || 'News & Updates';
        if (categoryDisplay.length > 25) {
          categoryDisplay = categoryDisplay.split(',')[0].trim();
        }

        return {
          id: item._id,
          type: 'article',
          aspectRatio: aspectRatios[(idx + (targetPage - 1) * currentLimit) % aspectRatios.length],
          title: item.title,
          excerpt: item.description || '',
          imageUrl: item.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
          publishedDate: formattedDate,
          readTime: `${readMins} mins read`,
          author: item.author || 'Editorial Team',
          category: categoryDisplay,
          rawDate: item.createdAt,
        };
      });

      setArticles((prev) => {
        if (targetPage === 1) return formattedArticles;
        // Filter duplicates
        const existingIds = new Set(prev.map((a) => a.id));
        const uniqueNew = formattedArticles.filter((a) => !existingIds.has(a.id));
        return [...prev, ...uniqueNew];
      });

      setPagination(paginationData);
    } catch (err: any) {
      console.error('Failed to fetch news page:', targetPage, err);
      setError(err?.formattedMessage || err?.message || 'Unable to connect to news server.');
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    setPage(1);
    fetchNewsPage(1);
  }, [fetchNewsPage]);

  // Handle loading next page using API pagination limit
  const loadNextPage = useCallback(() => {
    if (!initialLoading && !loadingMore && pagination?.hasNext) {
      const nextPage = (pagination?.page || page) + 1;
      const apiLimit = pagination?.limit;
      setPage(nextPage);
      fetchNewsPage(nextPage, apiLimit);
    }
  }, [initialLoading, loadingMore, pagination, page, fetchNewsPage]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          pagination?.hasNext &&
          !initialLoading &&
          !loadingMore &&
          !error
        ) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination, initialLoading, loadingMore, error, loadNextPage]);

  // Derived stories for top highlight tray
  const storiesData = useMemo(() => {
    if (articles.length === 0) return [];
    return articles.slice(0, 8).map((art, idx) => ({
      id: art.id,
      title: art.title,
      category: art.category,
      imageUrl: art.imageUrl,
      source: art.author || 'Enviro Junction',
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
    if (currentView.page === 'article' && currentView.articleId) {
      return articles.find((art) => art.id === currentView.articleId) || articles[0] || null;
    }
    return null;
  }, [currentView, articles]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16">
      {/* MAIN CONTAINER */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Live News Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sustainability & ESG Insights
            </h1>
          </div>
        </div>

        {/* MAIN FEED */}
        {currentView.page === 'home' && (
          <div className="space-y-10">
            
            {/* STORIES TRAY */}
            {storiesData.length > 0 && (
              <section className="py-2">
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
                  {storiesData.map((story, index) => (
                    <button
                      key={story.id}
                      onClick={() => launchStory(index)}
                      className="relative w-32 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden group shrink-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

                      <div className="absolute top-3 left-3 p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full z-20">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                          <img
                            src={story.avatar}
                            alt={story.source}
                            className="w-full h-full object-cover"
                          />
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

            {/* ERROR STATE */}
            {error && articles.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-red-900 text-base">Unable to load news</h3>
                  <p className="text-xs text-red-600 mt-1 max-w-md mx-auto">{error}</p>
                </div>
                <button
                  onClick={() => fetchNewsPage(1)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* INITIAL LOADING SKELETON */}
            {initialLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-video bg-slate-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-5/6" />
                      <div className="h-4 bg-slate-100 rounded w-full" />
                      <div className="h-4 bg-slate-100 rounded w-4/5" />
                      <div className="pt-4 border-t border-slate-50 flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MASONRY FEED */}
            {!initialLoading && articles.length > 0 && (
              <section className="space-y-8">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {articles.map((item) => (
                    <div
                      key={item.id}
                      className="break-inside-avoid relative inline-block w-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        if (item.type === 'article') {
                          setCurrentView({ page: 'article', articleId: item.id });
                        } else if (item.type === 'youtube' && item.youtubeId) {
                          setActiveYoutubeVideo(item.youtubeId);
                        }
                      }}
                    >
                      {item.imageUrl && (
                        <div className={`relative overflow-hidden ${item.aspectRatio || 'aspect-video'} bg-slate-50 border-b border-slate-100`}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs tracking-wider uppercase max-w-[80%] truncate">
                            {item.category}
                          </span>
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.publishedDate}</span>
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug tracking-tight group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {item.author}
                          </span>
                          {item.readTime && <span>{item.readTime}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SCROLL SENSING TARGET & INFINITE LOAD STATES */}
                <div ref={observerTarget} className="pt-6 pb-6 text-center space-y-4">
                  {loadingMore && (
                    <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm text-xs font-bold text-slate-700 animate-bounce">
                      <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Loading page {page + 1}...
                    </div>
                  )}

                  {pagination?.hasNext && !loadingMore && (
                    <button
                      onClick={loadNextPage}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition-all"
                    >
                      Scroll or Click to Load Page {page + 1} →
                    </button>
                  )}

                  {!pagination?.hasNext && articles.length > 0 && !loadingMore && (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-5 py-2.5 rounded-full text-xs font-bold text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      All {pagination?.total || articles.length} news articles loaded
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* EDITORIAL DETAIL PAGE */}
        {currentView.page === 'article' && activeArticle && (
          <div className="space-y-8 max-w-4xl mx-auto py-4 animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setCurrentView({ page: 'home', articleId: null })}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
            >
              ← Back to Live News Stream
            </button>

            <article className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-12 shadow-sm space-y-6">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                  {activeArticle.category}
                </span>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs pt-2 border-t border-slate-50">
                  <span className="text-slate-700 font-bold">By {activeArticle.author || "Editorial Team"}</span>
                  <span>•</span>
                  <span>Published: {activeArticle.publishedDate}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime || "5 mins read"}</span>
                </div>
              </div>

              {activeArticle.imageUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img
                    src={activeArticle.imageUrl}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
              )}

              <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-6">
                {activeArticle.excerpt && (
                  <p className="text-lg text-slate-800 font-medium italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/30 py-4 rounded-r-xl">
                    "{activeArticle.excerpt}"
                  </p>
                )}
                <p>
                  As global standards in environmental, social, and governance (ESG) compliance continue to evolve, staying updated with regulatory adjustments across key markets is critical for operational excellence.
                </p>
                <p>
                  Industry leaders recommend establishing continuous auditing practices to evaluate supply chain inputs, material traceability, and regulatory updates in chemical and packaging governance.
                </p>
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
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';
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
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center font-bold text-sm border border-white/10"
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
              className="absolute -top-12 right-0 md:top-4 md:right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white font-bold flex items-center justify-center transition-colors shadow-md z-50 border border-white/10"
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