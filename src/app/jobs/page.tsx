"use client";

import { useState } from "react";

import { jobs } from "@/lib/data";
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
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedJobs = jobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(jobs.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            <div className="flex-grow flex items-center px-3 border-r border-gray-200">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input placeholder="Job title, keyword, company" className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base" />
            </div>
            <div className="flex-grow flex items-center px-3 border-r border-gray-200">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <Input placeholder="Location" className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base" />
            </div>
            <div className="flex-grow flex items-center px-3 border-r border-gray-200">
              <Layers className="h-5 w-5 text-gray-400 mr-2" />
              <Select>
                <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-base text-gray-500 bg-transparent">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow flex items-center px-3">
              <Select>
                <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-base text-gray-500 bg-transparent">
                  <SelectValue placeholder="Advance Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">Filter 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-[#315D40] hover:bg-[#254A32] text-white px-8">Find Professionals</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
              Design <X className="h-3 w-3 cursor-pointer" />
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
              New York <X className="h-3 w-3 cursor-pointer" />
            </span>
          </div>
          <div className="flex items-center gap-4">
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
                {[
                  { label: "Full-time", count: 3 },
                  { label: "Part-Time", count: 5 },
                  { label: "Remote", count: 2 },
                  { label: "Internship", count: 24 },
                  { label: "Contract", count: 3 },
                ].map((item) => (
                  <FormControlLabel
                    key={item.label}
                    control={<CheckboxMUI size="small" color="success" />}
                    label={
                      <span className="text-sm text-gray-600">
                        {item.label} <span className="text-gray-400">({item.count})</span>
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
                {[
                  { label: "Design", count: 24 },
                  { label: "Sales", count: 3 },
                  { label: "Marketing", count: 3 },
                  { label: "Business", count: 3, checked: true },
                  { label: "Human Resource", count: 6 },
                  { label: "Finance", count: 4 },
                  { label: "Engineering", count: 4 },
                  { label: "Technology", count: 5, checked: true },
                ].map((item) => (
                  <FormControlLabel
                    key={item.label}
                    control={<CheckboxMUI size="small" color="success" defaultChecked={item.checked} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {item.label} <span className="text-gray-400">({item.count})</span>
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
                {[
                  { label: "Entry Level", count: 57 },
                  { label: "Mid Level", count: 3 },
                  { label: "Senior Level", count: 5 },
                  { label: "Director", count: 12, checked: true },
                  { label: "VP or Above", count: 8 },
                ].map((item) => (
                  <FormControlLabel
                    key={item.label}
                    control={<CheckboxMUI size="small" color="success" defaultChecked={item.checked} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {item.label} <span className="text-gray-400">({item.count})</span>
                      </span>
                    }
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Salary Range */}
            <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
                <span className="font-semibold text-gray-900 text-sm">Salary Range</span>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: "₹700 - ₹1000", count: 4 },
                  { label: "₹1000 - ₹1500", count: 6 },
                  { label: "₹1500 - ₹2000", count: 10 },
                  { label: "₹3000 or above", count: 4, checked: true },
                ].map((item) => (
                  <FormControlLabel
                    key={item.label}
                    control={<CheckboxMUI size="small" color="success" defaultChecked={item.checked} />}
                    label={
                      <span className="text-sm text-gray-600">
                        {item.label} <span className="text-gray-400">({item.count})</span>
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
                  {jobs.length > 0
                    ? `Showing ${startIndex + 1}–${Math.min(endIndex, jobs.length)} of ${jobs.length} results`
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

            <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} viewMode={viewMode} />
              ))}
            </div>

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
