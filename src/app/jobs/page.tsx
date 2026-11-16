"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Job } from "@/lib/types";
import { JobCard } from "./components/job-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, LayoutGrid, List, ChevronLeft, ChevronRight, X, Layers, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CheckboxMUI from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import api from "@/utils/api";
import { getJobEnvironmentalTags } from "@/utils/environmentalTags";

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

function JobsContent() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("latest");

  // Search/Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Read search query parameter from URL on load (e.g. from header search)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchKeyword(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Sidebar Filter States matching environmental industry & actual database
  const [empTypes, setEmpTypes] = useState<Record<string, boolean>>({
    "Full-time": false,
    "Contract": false,
    "Internship": false,
    "Remote": false,
    "Consultant": false,
    "Volunteer": false,
  });

  const [categories, setCategories] = useState<Record<string, boolean>>({
    "Renewable Energy": false,
    "Climate & Carbon": false,
    "Ecology & Biodiversity": false,
    "Water Resources": false,
    "Waste & Circularity": false,
    "Policy & Governance": false,
    "GIS & Mapping": false,
    "ESG & Sustainability": false,
    "Communications": false,
    "Research & Analysis": false,
  });

  const [jobLevels, setJobLevels] = useState<Record<string, boolean>>({
    "Entry Level / Associate": false,
    "Mid Level Specialist": false,
    "Senior / Lead": false,
    "Director & Above": false,
  });

  const handleEmpTypeChange = (type: string) => {
    setEmpTypes(prev => ({ ...prev, [type]: !prev[type] }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    setCurrentPage(1);
  };

  const handleJobLevelChange = (level: string) => {
    setJobLevels(prev => ({ ...prev, [level]: !prev[level] }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setLocationKeyword("");
    setCategoryFilter("all");
    setEmpTypes({
      "Full-time": false,
      "Contract": false,
      "Internship": false,
      "Remote": false,
      "Consultant": false,
      "Volunteer": false,
    });
    setCategories({
      "Renewable Energy": false,
      "Climate & Carbon": false,
      "Ecology & Biodiversity": false,
      "Water Resources": false,
      "Waste & Circularity": false,
      "Policy & Governance": false,
      "GIS & Mapping": false,
      "ESG & Sustainability": false,
      "Communications": false,
      "Research & Analysis": false,
    });
    setJobLevels({
      "Entry Level / Associate": false,
      "Mid Level Specialist": false,
      "Senior / Lead": false,
      "Director & Above": false,
    });
    setCurrentPage(1);
  };

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs', {
          params: { 
            page: currentPage, 
            limit: pageSize,
            ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}),
            ...(locationKeyword.trim() ? { location: locationKeyword.trim() } : {}),
            ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
          },
        });
        const result = response.data;
        
        if (result.data) {
          const mappedJobs: Job[] = result.data.map((job: any) => {
            const tags = getJobEnvironmentalTags({
              title: job.title,
              description: job.description,
              organisation: job.organisation,
              requirements: job.requirements,
              responsibilities: job.responsibilities,
              job_type: job.job_type,
            });

            return {
              id: job._id,
              title: job.title || "Untitled Environmental Role",
              company: job.organisation || "Environmental Organization",
              location: job.location || "Location not specified",
              type: job.job_type || "Full-time",
              postedDate: job.date_posted || "",
              description: job.description || "",
              logoUrl: "",
              logoHint: job.organisation ? job.organisation.charAt(0) : "E",
              tags,
            };
          });
          setJobsData(mappedJobs);
        }
        
        if (result.pagination) {
          setTotalPages(Math.max(result.pagination.pages || 1, 1));
          setTotalJobs(result.pagination.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, pageSize, searchKeyword, locationKeyword, categoryFilter]);

  // Client-side filtering for active sidebar refine checkboxes
  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      // 1. Employment Type Checkboxes
      const activeEmpTypes = Object.entries(empTypes).filter(([_, active]) => active).map(([type]) => type);
      if (activeEmpTypes.length > 0) {
        const matchesType = activeEmpTypes.some(t => {
          const typeLower = t.toLowerCase();
          if (typeLower === 'remote') {
            return job.location.toLowerCase().includes('remote') || job.title.toLowerCase().includes('remote');
          }
          return job.type.toLowerCase().includes(typeLower);
        });
        if (!matchesType) return false;
      }

      // 2. Category Checkboxes
      const activeCategories = Object.entries(categories).filter(([_, active]) => active).map(([cat]) => cat);
      if (activeCategories.length > 0) {
        const matchesCat = activeCategories.some(c => {
          const catLower = c.toLowerCase();
          return (
            (job.tags || []).some(t => t.toLowerCase().includes(catLower) || catLower.includes(t.toLowerCase())) ||
            job.title.toLowerCase().includes(catLower) || 
            job.description.toLowerCase().includes(catLower) ||
            job.company.toLowerCase().includes(catLower)
          );
        });
        if (!matchesCat) return false;
      }

      // 3. Job Level Checkboxes
      const activeJobLevels = Object.entries(jobLevels).filter(([_, active]) => active).map(([level]) => level);
      if (activeJobLevels.length > 0) {
        const matchesLevel = activeJobLevels.some(l => {
          const title = job.title.toLowerCase();
          if (l.includes('Entry')) return title.includes('junior') || title.includes('entry') || title.includes('associate') || title.includes('intern') || title.includes('assistant');
          if (l.includes('Mid')) return !title.includes('senior') && !title.includes('director') && !title.includes('head') && !title.includes('lead');
          if (l.includes('Senior')) return title.includes('senior') || title.includes('lead') || title.includes('principal') || title.includes('specialist');
          if (l.includes('Director')) return title.includes('director') || title.includes('head') || title.includes('chief') || title.includes('lead');
          return true;
        });
        if (!matchesLevel) return false;
      }

      return true;
    });
  }, [jobsData, empTypes, categories, jobLevels]);

  const displayedJobs = useMemo(() => {
    if (sortBy === 'oldest') {
      return [...filteredJobs].reverse();
    }
    return filteredJobs;
  }, [filteredJobs, sortBy]);

  // Requirement: Scroll to top smoothly when page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const hasActiveFilters = Boolean(
    searchKeyword.trim() !== "" || 
    locationKeyword.trim() !== "" || 
    categoryFilter !== "all" ||
    Object.values(empTypes).some(Boolean) || 
    Object.values(categories).some(Boolean) || 
    Object.values(jobLevels).some(Boolean)
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Header / Search Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 pb-6 pt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Environmental Jobs & Opportunities</h1>
              <p className="text-sm text-gray-500 mt-1">Discover careers in sustainability, climate policy, renewables, and conservation</p>
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-gray-900 font-medium">Jobs</span>
            </div>
          </div>

          {/* Search Bar Panel */}
          <div className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-xl shadow-sm p-2 gap-2">
            {/* Search Keyword */}
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              <Input 
                placeholder="Job title, organization, or keyword..." 
                className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchKeyword && (
                <X 
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" 
                  onClick={() => { setSearchKeyword(""); setCurrentPage(1); }} 
                />
              )}
            </div>

            {/* Location */}
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              <Input 
                placeholder="Location / Remote..." 
                className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full" 
                value={locationKeyword}
                onChange={(e) => {
                  setLocationKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {locationKeyword && (
                <X 
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" 
                  onClick={() => { setLocationKeyword(""); setCurrentPage(1); }} 
                />
              )}
            </div>

            {/* Sector / Category Dropdown */}
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <Layers className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-sm text-gray-600 bg-transparent w-full">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                  <SelectItem value="Climate">Climate & Carbon</SelectItem>
                  <SelectItem value="Ecology">Ecology & Wildlife</SelectItem>
                  <SelectItem value="Water">Water Resources</SelectItem>
                  <SelectItem value="Policy">Policy & Governance</SelectItem>
                  <SelectItem value="Sustainability">ESG & Sustainability</SelectItem>
                  <SelectItem value="Research">Research & Analysis</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters Toggle */}
            <div 
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap" 
              onClick={handleResetFilters}
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-sm font-medium text-gray-600">Reset</span>
            </div>

            {/* Search Trigger Button */}
            <Button 
              onClick={() => setCurrentPage(1)} 
              className="bg-[#315D40] hover:bg-[#254A32] text-white px-8 mt-2 md:mt-0 w-full md:w-auto font-semibold rounded-lg"
            >
              Find Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Active Filter Tags Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            {searchKeyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                Keyword: {searchKeyword} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => { setSearchKeyword(""); setCurrentPage(1); }} />
              </span>
            )}
            {locationKeyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                Location: {locationKeyword} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => { setLocationKeyword(""); setCurrentPage(1); }} />
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                Sector: {categoryFilter} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => { setCategoryFilter("all"); setCurrentPage(1); }} />
              </span>
            )}
            {Object.entries(empTypes).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                {k} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => handleEmpTypeChange(k)} />
              </span>
            ))}
            {Object.entries(categories).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                {k} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => handleCategoryChange(k)} />
              </span>
            ))}
            {Object.entries(jobLevels).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
                {k} 
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => handleJobLevelChange(k)} />
              </span>
            ))}
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold underline ml-1 cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-white border-gray-200 text-xs font-medium">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] bg-white border-gray-200 text-xs font-medium">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="24">24 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <Box className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-2xl h-fit py-2 shadow-xs">
            {/* Type of Employment */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '44px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Employment Type</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(empTypes).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={empTypes[label]} onChange={() => handleEmpTypeChange(label)} />}
                    label={<span className="text-xs text-gray-600">{label}</span>}
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Environmental Sectors */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '44px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Environmental Sectors</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(categories).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={categories[label]} onChange={() => handleCategoryChange(label)} />}
                    label={<span className="text-xs text-gray-600">{label}</span>}
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Experience Level */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '44px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Experience Level</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(jobLevels).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={jobLevels[label]} onChange={() => handleJobLevelChange(label)} />}
                    label={<span className="text-xs text-gray-600">{label}</span>}
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Job List Area */}
          <div className="flex-grow bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Available Positions</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {totalJobs > 0
                    ? `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalJobs)} of ${totalJobs} roles (Page ${currentPage} of ${totalPages})`
                    : "No jobs available"}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 hover:text-gray-700 bg-gray-50'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 hover:text-gray-700 bg-gray-50'}`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#315D40] mx-auto mb-3"></div>
                Loading environmental jobs...
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {displayedJobs.map((job) => (
                  <JobCard key={job.id} job={job} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 font-medium">No environmental jobs found matching your filters.</p>
                <Button onClick={handleResetFilters} className="mt-4 bg-[#315D40] hover:bg-[#254A32] text-white text-xs font-semibold rounded-lg">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-8 pt-6 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 rounded-lg border-gray-200"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPaginationRange(currentPage, totalPages).map((p, idx) => (
                  typeof p === 'number' ? (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p 
                          ? 'bg-[#315D40] text-white hover:bg-[#254A32] hover:text-white shadow-xs' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ) : (
                    <span key={`dots-${idx}`} className="px-1 text-gray-400 text-xs">...</span>
                  )
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 rounded-lg border-gray-200"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading jobs directory...</div>}>
      <JobsContent />
    </Suspense>
  );
}
