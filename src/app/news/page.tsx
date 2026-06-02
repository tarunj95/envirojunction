"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

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
  },{
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

];

// Clean editorial mixed feed (Articles and YouTube videos with varied card configurations and aspect ratios)
const mixedFeedData = [
  {
    id: 1,
    type: "article",
    aspectRatio: "aspect-video", // Creates dynamic layout heights
    title: "New ESG Compliance Framework Signed by 14 European Tech Hubs",
    excerpt: "A landmark micro-environmental treaty has been ratified targeting tech hub emissions, establishing strict local rules for computational energy overheads.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
    publishedDate: "28 May 2026",
    readTime: "6 mins read",
    author: "Juliet Vance",
    category: "Politics"
  },
  {
    id: 2,
    type: "youtube",
    aspectRatio: "aspect-[4/3]",
    title: "Can the world rely on renewable energy? | Future Earth",
    youtubeId: "gLvkWpnzba8",
    sourceChannel: "BBC News",
    thumbnailUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
    publishedDate: "20 Nov 2025",
    category: "Watch Now"
  },
  {
    id: 3,
    type: "article",
    aspectRatio: "aspect-[4/3]",
    title: "Silicon-Carbon Solid-State Batteries Enter Mass Factory Validation Phase",
    excerpt: "Pioneering battery manufacturers announce scalable modular cell outputs designed for long-range enterprise operations.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    publishedDate: "29 May 2026",
    readTime: "7 mins read",
    author: "Azumi Rose",
    category: "Tech"
  },
  {
    id: 4,
    type: "youtube",
    aspectRatio: "aspect-video",
    title: "How China is becoming a green superpower | News Focus",
    youtubeId: "-WixOOufH8o",
    sourceChannel: "BBC News",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    publishedDate: "20 Feb 2026",
    category: "Exclusive"
  },
  {
    id: 5,
    type: "article",
    aspectRatio: "aspect-square", // Taller layout element
    title: "Government Announces Tax Write-offs for Companies Retraining in Solar",
    excerpt: "New carbon-transition incentives aim to subsidize localized training courses for legacy corporate facility engineering teams, bridging the skill gap between fossil and solar operations.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    publishedDate: "25 May 2026",
    readTime: "4 mins read",
    author: "Markus Thorne",
    category: "Business"
  },
  {
    id: 6,
    type: "youtube",
    aspectRatio: "aspect-[16/10]",
    title: "Can Carbon Capture Reverse Climate Change? | Bloomberg Green",
    youtubeId: "OJXOlm8NLww",
    sourceChannel: "Bloomberg",
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600",
    publishedDate: "23 Mar 2025",
    category: "Analysis"
  },
  {
    id: 7,
    type: "article",
    aspectRatio: "aspect-video",
    title: "Green Hiring Outpaces Traditional Corporate Tech Roles by 3-to-1",
    excerpt: "Enterprise surveys reveal a sweeping shift in headcount resource priorities, with Chief Sustainability Officers leading budgets.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    publishedDate: "30 May 2026",
    readTime: "6 mins read",
    author: "Steven Vance",
    category: "Business"
  },
  {
    id: 8,
    type: "youtube",
    aspectRatio: "aspect-[4/3]",
    title: "Renewables Overtake Coal as World's Biggest Power Source",
    youtubeId: "ZiE6GdSeJeU",
    sourceChannel: "BBC News",
    thumbnailUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600",
    publishedDate: "07 Oct 2025",
    category: "World News"
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState({ page: 'home', articleId: null });
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState(null);

  const progressTimer = useRef(null);
  const storyDuration = 5000; 
  const updateInterval = 50;

  useEffect(() => {
    if (!isStoryViewerOpen || isStoryPaused) {
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

  const activeArticle = useMemo(() => {
    if (currentView.page === 'article' && currentView.articleId) {
      return mixedFeedData.find(art => art.id === currentView.articleId) || mixedFeedData[0];
    }
    return null;
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      
      {/* MAIN CONTAINER */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* VIEW 1: MAIN HOMEPAGE FEED */}
        {currentView.page === 'home' && (
          <div className="space-y-10">
            
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

            {/* MODERN EDITORIAL MASONRY FEED (Non-sticker, clean structured layout) */}
            <section className="space-y-6">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                
                {mixedFeedData.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="break-inside-avoid relative inline-block w-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        if (item.type === 'article') {
                          setCurrentView({ page: 'article', articleId: item.id });
                        } else if (item.type === 'youtube') {
                          setActiveYoutubeVideo(item.youtubeId);
                        }
                      }}
                    >
                      {/* Interactive Cover Asset (Varying aspect ratios create the dynamic height effect) */}
                      {item.type === 'article' && item.imageUrl && (
                        <div className={`relative overflow-hidden ${item.aspectRatio || 'aspect-video'} bg-slate-50 border-b border-slate-100`}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                          />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs tracking-wider uppercase">
                            {item.category}
                          </span>
                        </div>
                      )}

                      {/* YouTube Card Cover representation */}
                      {item.type === 'youtube' && item.thumbnailUrl && (
                        <div className={`relative overflow-hidden bg-slate-900 ${item.aspectRatio || 'aspect-video'} group/video`}>
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover brightness-95 transition-all duration-500 group-hover/video:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-all duration-300 group-hover/video:bg-black/45">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/video:scale-110">
                              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
                            VIDEO REPORT
                          </span>
                        </div>
                      )}

                      {/* Metadata and text details */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          <span>{item.type === 'youtube' ? 'Video Network' : item.category}</span>
                          <span>•</span>
                          <span>{item.publishedDate}</span>
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug tracking-tight hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}

                        {/* Flat, clean footer matching image's author details layout */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {item.type === 'youtube' ? item.sourceChannel : `By ${item.author}`}
                          </span>
                          {item.readTime && <span>{item.readTime}</span>}
                        </div>
                      </div>

                    </div>
                  );
                })}

              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: CLEAN Editorial DETAIL PAGE */}
        {currentView.page === 'article' && activeArticle && (
          <div className="space-y-8 max-w-4xl mx-auto py-6 animate-in slide-in-from-bottom duration-300">
            
            {/* Back anchor link */}
            <button 
              onClick={() => setCurrentView({ page: 'home', articleId: null })}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              ← Back to Overview Feed
            </button>

            {/* Article Canvas */}
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

              {/* Cover Banner */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50">
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rich Body Content */}
              <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-6">
                <p className="text-lg text-slate-800 font-medium italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/20 py-3 rounded-r-lg">
                  "{activeArticle.excerpt || "A landmark integration focusing on standard sustainability, carbon reduction quotas, and innovative corporate design frameworks."}"
                </p>
                <p>Preparing for interviews and structural industry audits remains one of the best methods to align your corporate output with green-sector expectations. Early observations show that clean, deliberate layouts deliver the highest standard compliance rates.</p>
                <p>We advise consulting target metrics from local environmental, social, and governance (ESG) standards ahead of major transitions. Focusing on fluid and clean architectural updates makes it easier to respond to systemic changes.</p>
              </div>

            </article>
          </div>
        )}

      </div>

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

      {/* YOUTUBE THEATER LIGHTBOX */}
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