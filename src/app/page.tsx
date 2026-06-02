"use client";
import { useState, useMemo, useEffect, useRef } from 'react';

// Foolproof high-quality inline SVG components to ensure zero dependency failure risks
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

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

// High-Fidelity Inline SVG Illustration matching the image's "Hiring" banner
const HiringIllustration = () => (
  <svg viewBox="0 0 240 140" className="w-full h-32 mx-auto my-3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="70" r="55" fill="#E8F5E9" opacity="0.6"/>
    <rect x="30" y="90" width="180" height="4" rx="2" fill="#A5D6A7" opacity="0.4"/>
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

const storiesData = [
  {
    id: 1,
    title: "11 Tips to Help You Get New Clients in Renewables",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    source: "Echo Network",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    title: "Inside the New Global ESG Reporting Standards",
    category: "Politics",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    source: "Policy Digest",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 3,
    title: "How Biophilic Office Walls Increase Tech Team Focus",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    source: "NM TJAY",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 4,
    title: "10 Carbon Tariff Pitfalls Every CFO Must Avoid",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    source: "Echo Network",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 5,
    title: "The Silent Green Hydrogen Revolution of 2026",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    source: "Future Grid",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  }, {
    id: 6,
    title: "11 Tips to Help You Get New Clients in Renewables",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    source: "Echo Network",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 7,
    title: "Inside the New Global ESG Reporting Standards",
    category: "Politics",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    source: "Policy Digest",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 8,
    title: "How Biophilic Office Walls Increase Tech Team Focus",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    source: "NM TJAY",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  },

];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(8);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [hiringFormSubmitted, setHiringFormSubmitted] = useState(false);

  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  const progressTimerRef = useRef(null);
  const storyDuration = 5000; // 5 seconds per story slide
  const updateInterval = 50; // smooth 50ms ticks

  const initialNewsArticles = [
    {
      id: 1,
      title: "21 Job Interview Tips: How To Make a Great Impression",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-indigo-600"
    },
    {
      id: 2,
      title: "Email Examples: How To Respond to Employer Interview Requests",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-emerald-600"
    },
    {
      id: 3,
      title: "Email Examples: How To Respond to Employer Interview Requests",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-emerald-600"
    },
    {
      id: 4,
      title: "21 Job Interview Tips: How To Make a Great Impression",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-indigo-600"
    },
    {
      id: 5,
      title: "21 Job Interview Tips: How To Make a Great Impression",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-indigo-600"
    },
    {
      id: 6,
      title: "Email Examples: How To Respond to Employer Interview Requests",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "25 May 2026",
      readTime: "8 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-emerald-600"
    },
    {
      id: 7,
      title: "Email Examples: How To Respond to Employer Interview Requests",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "26 May 2026",
      readTime: "6 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-emerald-600"
    },
    {
      id: 8,
      title: "21 Job Interview Tips: How To Make a Great Impression",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      source: "Azumi Rose",
      publishedDate: "27 May 2026",
      readTime: "10 mins to read",
      description: "Our mission is to create the world's most sustainable healthcare company by creating high quality healthcare products in iconic, sustainable packaging.",
      authorColor: "bg-indigo-600"
    }
  ];

  const trendingNow = [
    { id: 1, iconType: "folder", title: "How to get better agents in New York, USA", source: "Sugar Bloom", date: "17 Sep" },
    { id: 2, iconType: "fist", title: "How To Create a Resume for a Job in Social Media", source: "Harding", date: "17 Sep" },
    { id: 3, iconType: "target", title: "10 Ways To Avoid a Refuse Disaster Zone", source: "Steven", date: "23 Sep" },
    { id: 4, iconType: "folder", title: "How to get better agents in New York, USA", source: "Sugar Bloom", date: "17 Sep" },
    { id: 5, iconType: "fist", title: "How To Create a Resume for a Job in Social Media", source: "Harding", date: "17 Sep" },
  ];

  const galleryImages = [
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

  useEffect(() => {
    if (!isStoryViewerOpen || isStoryPaused) {
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
  }, [isStoryViewerOpen, activeStoryIdx, isStoryPaused]);

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

  const launchStory = (index) => {
    setActiveStoryIdx(index);
    setStoryProgress(0);
    setIsStoryViewerOpen(true);
    setIsStoryPaused(false);
  };

  const renderIcon = (type) => {
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

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return initialNewsArticles;
    const query = searchQuery.toLowerCase();
    return initialNewsArticles.filter(article =>
      (article.title?.toLowerCase() || "").includes(query) ||
      (article.description?.toLowerCase() || "").includes(query) ||
      (article.source?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery]);

  const displayedArticles = filteredArticles.slice(0, visibleArticlesCount);

  const handleLoadMore = () => {
    setVisibleArticlesCount(prev => Math.min(prev + 2, filteredArticles.length));
  };

  const handleHiringSubmit = (e) => {
    e.preventDefault();
    setHiringFormSubmitted(true);
    setTimeout(() => {
      setHiringFormSubmitted(false);
      setShowHiringModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20 bg-slate-50">

      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* STORIES TRAY (Clean, background-free Facebook style integration) */}
        <section className="py-2">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {storiesData.map((story, index) => (
              <button
                key={story.id}
                onClick={() => launchStory(index)}
                className="relative w-32 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden group shrink-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none bg-slate-900"
              >
                <img 
                  src={story.imageUrl} 
                  alt={story.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Dark gradient mapping for copy legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

                {/* Left top floating publisher avatar */}
                <div className="absolute top-3 left-3 p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full z-20">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <img 
                      src={story.avatar} 
                      alt={story.source} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bottom overlay info */}
                <div className="absolute inset-x-3 bottom-3 text-left z-20">
                  <span className="block text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-0.5">
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

        {/* BOTTOM LAYOUT GRID: LATEST ARTICLES & SIDEBAR */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.85fr]">
          
          {/* LEFT COLUMN: LATEST POSTS FEED */}
          <section className="space-y-8">
           

            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No posts found matching your search term.</p>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="mt-4 px-5 py-2 text-xs font-semibold bg-[#1B3B2B] text-white rounded-full hover:bg-emerald-800 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {displayedArticles.map((article) => (
                  <article 
                    key={article.id} 
                    className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Cover image wrapper */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-2 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#1B3B2B] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                          {article.description}
                        </p>
                      </div>

                      {/* Footer Info line matching the image mock precisely */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] font-semibold text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full ${article.authorColor} flex items-center justify-center text-white text-[9px]`}>
                            👤
                          </span>
                          <span>{article.source}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span>{article.publishedDate}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More Trigger Button with circular SVG arrow */}
            {filteredArticles.length > visibleArticlesCount && (
              <div className="flex justify-center pt-6">
                <button 
                  onClick={handleLoadMore}
                  className="flex items-center gap-2.5 bg-[#00C853] hover:bg-[#00b04a] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                  </svg>
                  <span>View More</span>
                </button>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="space-y-6">

            {/* Trending Now Widget with Dynamic Icon Renderers */}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Trending Now</h3>
              <div className="space-y-4">
                {trendingNow.map((item) => (
                  <div key={item.id} className="flex gap-4 group cursor-pointer">
                    <div className="shrink-0">{renderIcon(item.iconType)}</div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {item.source} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Interactive Hiring Box */}
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
                onClick={() => setShowHiringModal(true)}
                className="w-full bg-[#00C853] hover:bg-[#00b04a] text-white font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-2xl transition duration-300 shadow-md hover:shadow-lg mt-2"
              >
                Know More
              </button>
            </div>

            {/* Gallery Section */}
            <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((src, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer">
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
      </main>

      {/* VIEW 3: FULL SCREEN PROGRESSIVE STORY OVERLAY (Facebook style) */}
      {isStoryViewerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center select-none"
          onMouseDown={() => setIsStoryPaused(true)}
          onMouseUp={() => setIsStoryPaused(false)}
          onTouchStart={() => setIsStoryPaused(true)}
          onTouchEnd={() => setIsStoryPaused(false)}
        >
          {/* Progress Segments */}
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

          {/* Central Frame */}
          <div className="relative w-full max-w-lg h-full max-h-screen md:h-[85vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between">
            
            <img 
              src={storiesData[activeStoryIdx].imageUrl} 
              alt={storiesData[activeStoryIdx].title} 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10 pointer-events-none" />

            {/* Header info */}
            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={storiesData[activeStoryIdx].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">
                    {storiesData[activeStoryIdx].source}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    {storiesData[activeStoryIdx].category}
                  </span>
                </div>
              </div>

              {/* Close Button */}
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

            {/* Left and Right skip tapping panels */}
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

            {/* Story Text Copy */}
            <div className="relative z-20 p-8 space-y-4 pointer-events-none">
              <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {storiesData[activeStoryIdx].title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-white/50 font-medium border-t border-white/10 pt-4">
                <span>Hold to pause</span>
                <span className="text-emerald-400 font-bold">TAP RIGHT TO SKIP →</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* HIRING MODAL PREVIEW DIALOG */}
      {showHiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative animate-in fade-in duration-200">
            
            <button 
              onClick={() => setShowHiringModal(false)}
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
                      rows="3"
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
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}