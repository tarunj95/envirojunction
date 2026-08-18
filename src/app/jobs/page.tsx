"use client";

import { useState, useEffect } from "react";
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
import { Search, MapPin, LayoutGrid, List, ChevronLeft, ChevronRight, X, Layers } from "lucide-react";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CheckboxMUI from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Search/Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Sidebar Filter States
  const [empTypes, setEmpTypes] = useState<Record<string, boolean>>({
    "Full-time": false,
    "Part-Time": false,
    "Remote": false,
    "Internship": false,
    "Contract": false,
  });

  const [categories, setCategories] = useState<Record<string, boolean>>({
    "Design": false,
    "Sales": false,
    "Marketing": false,
    "Business": false,
    "Human Resource": false,
    "Finance": false,
    "Engineering": false,
    "Technology": false,
  });

  const [jobLevels, setJobLevels] = useState<Record<string, boolean>>({
    "Entry Level": false,
    "Mid Level": false,
    "Senior Level": false,
    "Director": false,
    "VP or Above": false,
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
      "Part-Time": false,
      "Remote": false,
      "Internship": false,
      "Contract": false,
    });
    setCategories({
      "Design": false,
      "Sales": false,
      "Marketing": false,
      "Business": false,
      "Human Resource": false,
      "Finance": false,
      "Engineering": false,
      "Technology": false,
    });
    setJobLevels({
      "Entry Level": false,
      "Mid Level": false,
      "Senior Level": false,
      "Director": false,
      "VP or Above": false,
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api-backend/jobs?page=${currentPage}&limit=${pageSize}`);
        const result = await response.json();
        
        if (result.data) {
          const mappedJobs: Job[] = result.data.map((job: any) => ({
            id: job._id,
            title: job.title || "Untitled Job",
            company: job.organisation || "Unknown Company",
            location: job.location || "Location not specified",
            type: job.job_type || "Full-time",
            postedDate: job.date_posted || "",
            description: job.description || "",
            logoUrl: "",
            logoHint: job.organisation ? job.organisation.charAt(0) : "J",
            tags: [],
          }));
          setJobsData(mappedJobs);
        }
        
        if (result.pagination) {
          setTotalPages(result.pagination.pages || 1);
          setTotalJobs(result.pagination.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, pageSize]);

  // Apply filters
  const filteredJobs = jobsData.filter((job) => {
    // 1. Keyword search
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(kw);
      const companyMatch = job.company.toLowerCase().includes(kw);
      const descMatch = job.description.toLowerCase().includes(kw);
      if (!titleMatch && !companyMatch && !descMatch) return false;
    }

    // 2. Location search
    if (locationKeyword.trim() !== "") {
      const locKw = locationKeyword.toLowerCase();
      if (!job.location.toLowerCase().includes(locKw)) return false;
    }

    // 3. Category Dropdown
    if (categoryFilter !== "all") {
      const cat = categoryFilter.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(cat);
      const descMatch = job.description.toLowerCase().includes(cat);
      if (!titleMatch && !descMatch) return false;
    }

    // 4. Employment Type Checkboxes
    const activeEmpTypes = Object.entries(empTypes).filter(([_, active]) => active).map(([type]) => type);
    if (activeEmpTypes.length > 0) {
      // Check if job type matches any selected type (or contains the word)
      const matchesType = activeEmpTypes.some(t => job.type.toLowerCase().includes(t.toLowerCase()) || (t === 'Remote' && (job.location.toLowerCase().includes('remote') || job.title.toLowerCase().includes('remote'))));
      if (!matchesType) return false;
    }

    // 5. Category Checkboxes
    const activeCategories = Object.entries(categories).filter(([_, active]) => active).map(([cat]) => cat);
    if (activeCategories.length > 0) {
      const matchesCat = activeCategories.some(c => 
        job.title.toLowerCase().includes(c.toLowerCase()) || 
        job.description.toLowerCase().includes(c.toLowerCase()) ||
        job.company.toLowerCase().includes(c.toLowerCase())
      );
      if (!matchesCat) return false;
    }

    // 6. Job Level Checkboxes
    const activeJobLevels = Object.entries(jobLevels).filter(([_, active]) => active).map(([level]) => level);
    if (activeJobLevels.length > 0) {
      const matchesLevel = activeJobLevels.some(l => {
        const levelLower = l.toLowerCase();
        if (levelLower === 'entry level') return job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('entry') || job.title.toLowerCase().includes('associate') || job.title.toLowerCase().includes('graduate');
        if (levelLower === 'senior level') return job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead') || job.title.toLowerCase().includes('principal');
        if (levelLower === 'vp or above') return job.title.toLowerCase().includes('vp') || job.title.toLowerCase().includes('vice president') || job.title.toLowerCase().includes('head');
        return job.title.toLowerCase().includes(levelLower.replace(' level', ''));
      });
      if (!matchesLevel) return false;
    }

    return true;
  });

  const displayedJobs = filteredJobs;
  const currentCount = displayedJobs.length;
  // Use frontend pagination index for display if needed, but since we fetch server-side, 
  // the start index should just reflect what page we are on from the server's perspective,
  // however, since filtering is client-side right now on top of the fetched page,
  // it might be better to just show the count of filtered items.
  const startIndex = (currentPage - 1) * pageSize;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const hasActiveFilters = searchKeyword !== "" || locationKeyword !== "" || categoryFilter !== "all" ||
    Object.values(empTypes).some(Boolean) || Object.values(categories).some(Boolean) || Object.values(jobLevels).some(Boolean);

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Header / Search Section */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 pb-6 pt-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Find Professionals</h1>
            <div className="text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900">Home</Link> <span className="mx-1">/</span> <span className="text-gray-900">Find Professionals</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-sm p-2 gap-2">
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input 
                placeholder="Job title, keyword, company" 
                className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <Input 
                placeholder="Location" 
                className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full" 
                value={locationKeyword}
                onChange={(e) => {
                  setLocationKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex-grow flex items-center px-3 border-r border-gray-200 w-full md:w-auto py-2 md:py-0">
              <Layers className="h-5 w-5 text-gray-400 mr-2" />
              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-base text-gray-500 bg-transparent w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow flex items-center px-3 w-full md:w-auto py-2 md:py-0 cursor-pointer hover:bg-gray-50 rounded transition-colors" onClick={handleResetFilters}>
              <span className="text-sm font-medium text-gray-600 select-none whitespace-nowrap">Reset Filters</span>
            </div>
            <Button className="bg-[#315D40] hover:bg-[#254A32] text-white px-8 mt-2 md:mt-0 w-full md:w-auto">Find Professionals</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-wrap gap-2">
            {searchKeyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                Keyword: {searchKeyword} <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchKeyword("")} />
              </span>
            )}
            {locationKeyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                Location: {locationKeyword} <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationKeyword("")} />
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                Category: {categoryFilter} <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
              </span>
            )}
            {Object.entries(empTypes).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                {k} <X className="h-3 w-3 cursor-pointer" onClick={() => handleEmpTypeChange(k)} />
              </span>
            ))}
            {Object.entries(categories).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                {k} <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(k)} />
              </span>
            ))}
            {Object.entries(jobLevels).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                {k} <X className="h-3 w-3 cursor-pointer" onClick={() => handleJobLevelChange(k)} />
              </span>
            ))}
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold underline ml-1 self-center"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select defaultValue="latest">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] bg-white">
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
          {/* Sidebar */}
          <Box className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg h-fit py-2">
            {/* Type of Employment */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Type of Employment</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(empTypes).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={empTypes[label]} onChange={() => handleEmpTypeChange(label)} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {label}
                      </span>
                    }
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Categories */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Categories</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(categories).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={categories[label]} onChange={() => handleCategoryChange(label)} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {label}
                      </span>
                    }
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Job Level */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Job Level</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {Object.keys(jobLevels).map((label) => (
                  <FormControlLabel
                    key={label}
                    control={<CheckboxMUI size="small" color="success" checked={jobLevels[label]} onChange={() => handleJobLevelChange(label)} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {label}
                      </span>
                    }
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Job List */}
          <div className="flex-grow bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-medium text-gray-900">All Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {currentCount > 0
                    ? `Showing ${currentCount} results (Page ${currentPage})`
                    : "Showing 0 results"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <Select defaultValue="relevant">
                    <SelectTrigger className="border-0 bg-transparent shadow-none font-medium text-gray-900 px-2">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevant">Most relevant</SelectItem>
                      <SelectItem value="recent">Most recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading jobs...</div>
            ) : displayedJobs.length > 0 ? (
              <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {displayedJobs.map((job) => (
                  <JobCard key={job.id} job={job} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No jobs found matching your filter criteria.</p>
                <Button onClick={handleResetFilters} className="mt-4 bg-[#315D40] hover:bg-[#254A32] text-white">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 ${
                      currentPage === page 
                        ? 'bg-[#315D40] text-white hover:bg-[#254A32] hover:text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500"
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
