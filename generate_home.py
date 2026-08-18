import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# We need to construct the new content.
# Since it's large, we'll write a Python script that pieces it together
# and uses the exact original SVG components.

# Get the SVG components (SearchIcon to HiringIllustration)
svg_match = re.search(r'(const SearchIcon.*?const storiesData =)', content, re.DOTALL)
if svg_match:
    svg_comps = svg_match.group(1).replace('const storiesData =', '')
else:
    svg_comps = ""

new_code = f"""
"use client";
import {{ useState, useMemo, useEffect, useRef, useCallback }} from 'react';
import Link from 'next/link';

{svg_comps.strip()}

export default function App() {{
  const [searchQuery, setSearchQuery] = useState("");
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [hiringFormSubmitted, setHiringFormSubmitted] = useState(false);

  // Stories
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  const progressTimerRef = useRef<any>(null);
  const storyDuration = 5000; // 5 seconds per story slide
  const updateInterval = 50; // smooth 50ms ticks

  // Infinite Scroll & Mixed Data States
  const [page, setPage] = useState(1);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [newsOnly, setNewsOnly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(async (targetPage: number) => {{
    if (targetPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {{
      const [newsRes, jobsRes] = await Promise.all([
        fetch(`/api/news?page=${{targetPage}}&limit=10`).catch(() => null),
        fetch(`/api-backend/jobs?page=${{targetPage}}&limit=10`).catch(() => null)
      ]);

      const newsData = newsRes?.ok ? await newsRes.json() : {{ data: [], pagination: {{ hasNext: false }} }};
      const jobsData = jobsRes?.ok ? await jobsRes.json() : {{ data: [], pagination: {{ pages: 1 }} }};

      const newsItems = (newsData.data || []).map((n: any) => ({{
        ...n,
        feedType: 'news',
        sortDate: new Date(n.createdAt || Date.now()).getTime(),
      }}));

      const jobsItems = (jobsData.data || []).map((j: any) => ({{
        ...j,
        feedType: 'job',
        sortDate: new Date(j.date_posted || j.createdAt || Date.now()).getTime(),
      }}));

      const combined = [...newsItems, ...jobsItems].sort((a, b) => b.sortDate - a.sortDate);

      setNewsOnly(prev => {{
         const newUnique = newsItems.filter(n => !prev.some(p => p._id === n._id));
         return [...prev, ...newUnique];
      }});

      setFeedItems(prev => {{
         if (targetPage === 1) return combined;
         const existingIds = new Set(prev.map(p => p._id));
         const newUnique = combined.filter(c => !existingIds.has(c._id));
         return [...prev, ...newUnique];
      }});

      const newsHasNext = newsData.pagination?.hasNext;
      const jobsHasNext = targetPage < (jobsData.pagination?.pages || 1);
      
      setHasNextPage(newsHasNext || jobsHasNext);
    }} catch (err) {{
      console.error(err);
    }} finally {{
      setLoading(false);
      setLoadingMore(false);
    }}
  }}, []);

  useEffect(() => {{
    fetchPage(1);
  }}, [fetchPage]);

  const loadNextPage = useCallback(() => {{
    if (!loading && !loadingMore && hasNextPage) {{
      setPage(p => p + 1);
      fetchPage(page + 1);
    }}
  }}, [loading, loadingMore, hasNextPage, page, fetchPage]);

  // Infinite Scroll Observer
  useEffect(() => {{
    const observer = new IntersectionObserver(
      (entries) => {{
        if (entries[0].isIntersecting && hasNextPage && !loading && !loadingMore) {{
          loadNextPage();
        }}
      }},
      {{ threshold: 0.1, rootMargin: '100px' }}
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {{
      if (target) observer.unobserve(target);
    }};
  }}, [hasNextPage, loading, loadingMore, loadNextPage]);

  // Derived Stories
  const storiesData = useMemo(() => {{
    if (newsOnly.length === 0) return [];
    return newsOnly.slice(0, 10).map((art, idx) => ({{
      id: art._id,
      title: art.title,
      category: art.category || "News",
      imageUrl: art.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      source: art.author || "Enviro Junction",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    }}));
  }}, [newsOnly]);

  // Trending Now
  const trendingNow = useMemo(() => {{
    return feedItems.slice(0, 5).map((item, idx) => {{
      const isNews = item.feedType === 'news';
      const iconTypes = ["folder", "fist", "target"];
      return {{
        id: item._id,
        iconType: iconTypes[idx % 3],
        title: item.title,
        source: isNews ? (item.author || "Editorial") : (item.organisation || "Company"),
        date: new Date(item.sortDate).toLocaleDateString('en-GB', {{ day: '2-digit', month: 'short' }}),
        url: isNews ? '/news' : `/jobs/${{item._id}}`
      }};
    }});
  }}, [feedItems]);

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
    "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=150"
  ];
  
  const galleryImages = useMemo(() => {{
    const fromNews = newsOnly.filter(n => n.image).map(n => n.image);
    const combined = [...fromNews, ...defaultImages];
    return combined.slice(0, 9);
  }}, [newsOnly]);

  const filteredItems = useMemo(() => {{
    if (!searchQuery.trim()) return feedItems;
    const query = searchQuery.toLowerCase();
    return feedItems.filter(item =>
      (item.title?.toLowerCase() || "").includes(query) ||
      (item.description?.toLowerCase() || "").includes(query) ||
      (item.author?.toLowerCase() || item.organisation?.toLowerCase() || "").includes(query)
    );
  }}, [searchQuery, feedItems]);

  useEffect(() => {{
    if (!isStoryViewerOpen || isStoryPaused || storiesData.length === 0) {{
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }}

    progressTimerRef.current = setInterval(() => {{
      setStoryProgress((prev) => {{
        if (prev >= 100) {{
          handleNextStory();
          return 0;
        }}
        return prev + (updateInterval / storyDuration) * 100;
      }});
    }}, updateInterval);

    return () => {{
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }};
  }}, [isStoryViewerOpen, activeStoryIdx, isStoryPaused, storiesData]);

  const handleNextStory = () => {{
    setStoryProgress(0);
    if (activeStoryIdx < storiesData.length - 1) {{
      setActiveStoryIdx((prev) => prev + 1);
    }} else {{
      setIsStoryViewerOpen(false);
    }}
  }};

  const handlePrevStory = () => {{
    setStoryProgress(0);
    if (activeStoryIdx > 0) {{
      setActiveStoryIdx((prev) => prev - 1);
    }}
  }};

  const launchStory = (index: number) => {{
    setActiveStoryIdx(index);
    setStoryProgress(0);
    setIsStoryViewerOpen(true);
    setIsStoryPaused(false);
  }};

  const renderIcon = (type: string) => {{
    switch (type) {{
      case "folder":
        return <FolderIcon />;
      case "fist":
        return <FistIcon />;
      case "target":
        return <TargetIcon />;
      default:
        return null;
    }}
  }};

  const handleHiringSubmit = (e: React.FormEvent) => {{
    e.preventDefault();
    setHiringFormSubmitted(true);
    setTimeout(() => {{
      setHiringFormSubmitted(false);
      setShowHiringModal(false);
    }}, 2000);
  }};

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20 bg-slate-50">

      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {{/* STORIES TRAY */}}
        <section className="py-2">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {{storiesData.map((story, index) => (
              <button
                key={{story.id}}
                onClick={{() => launchStory(index)}}
                className="relative w-32 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden group shrink-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none bg-slate-900"
              >
                <img 
                  src={{story.imageUrl}} 
                  alt={{story.title}} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={{(e) => {{ (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' }}}}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

                <div className="absolute top-3 left-3 p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full z-20">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <img 
                      src={{story.avatar}} 
                      alt={{story.source}} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute inset-x-3 bottom-3 text-left z-20">
                  <span className="block text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-0.5 truncate">
                    {{story.category}}
                  </span>
                  <p className="text-white text-xs font-bold leading-snug line-clamp-2">
                    {{story.title}}
                  </p>
                </div>
              </button>
            ))}}
          </div>
        </section>

        {{/* BOTTOM LAYOUT GRID: LATEST ARTICLES & SIDEBAR */}}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.85fr]">
          
          {{/* LEFT COLUMN: LATEST POSTS FEED */}}
          <section className="space-y-8">
           
            {{filteredItems.length === 0 && !loading ? (
              <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No posts found matching your search term.</p>
                <button 
                  onClick={{() => setSearchQuery("")}} 
                  className="mt-4 px-5 py-2 text-xs font-semibold bg-[#1B3B2B] text-white rounded-full hover:bg-emerald-800 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {{filteredItems.map((item) => {{
                  const isNews = item.feedType === 'news';
                  const imageUrl = isNews 
                    ? (item.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600")
                    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600";
                  
                  const category = isNews ? (item.category || "News") : (item.job_type || "Job");
                  const title = item.title;
                  const description = item.description || "";
                  const author = isNews ? (item.author || "Editorial") : (item.organisation || "Company");
                  const authorColor = isNews ? "bg-indigo-600" : "bg-emerald-600";
                  const date = new Date(item.sortDate).toLocaleDateString('en-GB', {{ day: '2-digit', month: 'short', year: 'numeric' }});
                  const readTime = isNews ? "5 mins read" : (item.location || "Remote");

                  return (
                    <Link href={{isNews ? '/news' : `/jobs/${{item._id}}`}} key={{item._id}}>
                      <article className="group h-full flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        {{/* Cover image wrapper */}}
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                          <img 
                            src={{imageUrl}} 
                            alt={{title}} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={{(e) => {{ (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600' }}}}
                          />
                          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm text-emerald-800 uppercase tracking-widest">
                            {{isNews ? "NEWS" : "JOB"}}
                          </span>
                        </div>
                        
                        {{/* Content */}}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full truncate max-w-[80%]">
                              {{category}}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#1B3B2B] transition-colors line-clamp-2">
                              {{title}}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                              {{description}}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className={{`w-5 h-5 rounded-full ${{authorColor}} flex items-center justify-center text-white text-[9px]`}}>
                                {isNews ? "📝" : "🏢"}
                              </span>
                              <span className="truncate max-w-[100px]">{{author}}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                              <span>{{date}}</span>
                              <span>•</span>
                              <span className="truncate max-w-[80px]">{{readTime}}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                }})}
              </div>
            )}}

            {{/* Loading & Infinite Scroll Target */}}
            <div ref={{observerTarget}} className="py-8 flex justify-center">
              {{loadingMore && (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                  Loading more items...
                </div>
              )}}
              {{!hasNextPage && filteredItems.length > 0 && (
                <div className="text-gray-400 text-sm font-medium">
                  You have reached the end of the feed.
                </div>
              )}}
            </div>

          </section>

          {{/* RIGHT COLUMN: SIDEBAR WITH STICKY TO TOP */}}
          <aside className="space-y-6 sticky top-6 self-start">

            {{/* Trending Now Widget */}}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Trending Now</h3>
              <div className="space-y-4">
                {{trendingNow.map((item) => (
                  <Link href={{item.url}} key={{item.id}} className="flex gap-4 group cursor-pointer">
                    <div className="shrink-0">{{renderIcon(item.iconType)}}</div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {{item.title}}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {{item.source}} • {{item.date}}
                      </p>
                    </div>
                  </Link>
                ))}}
              </div>
            </div>

            {{/* Premium Interactive Hiring Box */}}
            <div className="p-6 bg-[#E8F5E9]/80 border border-emerald-100 rounded-[2rem] relative overflow-hidden flex flex-col justify-between shadow-sm">
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
                onClick={{() => setShowHiringModal(true)}}
                className="w-full bg-[#00C853] hover:bg-[#00b04a] text-white font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-2xl transition duration-300 shadow-md hover:shadow-lg mt-2"
              >
                Know More
              </button>
            </div>

            {{/* Gallery Section */}}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {{galleryImages.map((src, index) => (
                  <div key={{index}} className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer">
                    <img 
                      src={{src}} 
                      alt={{`Gallery ${{index}}`}} 
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {{/* STORIES LIGHTBOX / FULLSCREEN STORY VIEWER */}}
      {{isStoryViewerOpen && storiesData.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center select-none"
          onMouseDown={{() => setIsStoryPaused(true)}}
          onMouseUp={{() => setIsStoryPaused(false)}}
          onTouchStart={{() => setIsStoryPaused(true)}}
          onTouchEnd={{() => setIsStoryPaused(false)}}
        >
          {{/* Progress Segments */}}
          <div className="absolute top-4 inset-x-0 max-w-lg mx-auto px-4 z-50 flex gap-1.5">
            {{storiesData.map((_, index) => {{
              let width = "0%";
              if (index < activeStoryIdx) width = "100%";
              if (index === activeStoryIdx) width = `${{storyProgress}}%`;
              return (
                <div key={{index}} className="h-1 bg-white/25 rounded-full flex-1 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-75 ease-linear"
                    style={{{{ width }}}}
                  />
                </div>
              );
            }})}}
          </div>

          {{/* Central Frame */}}
          <div className="relative w-full max-w-lg h-full max-h-screen md:h-[85vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between">
            
            <img 
              src={{storiesData[activeStoryIdx]?.imageUrl}} 
              alt={{storiesData[activeStoryIdx]?.title}} 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10 pointer-events-none" />

            {{/* Header info */}}
            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={{storiesData[activeStoryIdx]?.avatar}} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">
                    {{storiesData[activeStoryIdx]?.source}}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    {{storiesData[activeStoryIdx]?.category}}
                  </span>
                </div>
              </div>

              {{/* Close Button */}}
              <button 
                onClick={{(e) => {{
                  e.stopPropagation();
                  setIsStoryViewerOpen(false);
                }}}}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center font-bold text-sm border border-white/10"
              >
                ✕
              </button>
            </div>

            {{/* Left and Right skip tapping panels */}}
            <div className="absolute inset-y-0 inset-x-0 z-15 flex pointer-events-auto">
              <div 
                onClick={{(e) => {{
                  e.stopPropagation();
                  handlePrevStory();
                }}}}
                className="w-1/3 h-full cursor-w-resize"
              />
              <div 
                onClick={{(e) => {{
                  e.stopPropagation();
                  handleNextStory();
                }}}}
                className="w-2/3 h-full cursor-e-resize"
              />
            </div>

            {{/* Story Text Copy */}}
            <div className="relative z-20 p-8 space-y-4 pointer-events-none">
              <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {{storiesData[activeStoryIdx]?.title}}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-white/50 font-medium border-t border-white/10 pt-4">
                <span>Hold to pause</span>
                <span className="text-emerald-400 font-bold">TAP RIGHT TO SKIP →</span>
              </div>
            </div>

          </div>
        </div>
      )}}

      {{/* HIRING MODAL PREVIEW DIALOG */}}
      {{showHiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative animate-in fade-in duration-200">
            
            <button 
              onClick={{() => setShowHiringModal(false)}}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-lg"
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

              {{hiringFormSubmitted ? (
                <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
                  <p className="text-sm font-bold">🎉 Success!</p>
                  <p className="text-xs">We will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={{handleHiringSubmit}} className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">YOUR NAME</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">BUSINESS EMAIL</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jane@company.com"
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">PROJECT DETAILS</label>
                    <textarea 
                      rows={{3}}
                      placeholder="I'm looking for high-quality sustainable packaging developers..."
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-800"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors mt-2"
                  >
                    Submit Request
                  </button>
                </form>
              )}}
            </div>
          </div>
        </div>
      )}}

    </div>
  );
}}
"""

with open("src/app/page.tsx", "w") as f:
    f.write(new_code)
