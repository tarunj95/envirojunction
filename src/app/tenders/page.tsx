"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tender } from "@/lib/types";
import api from "@/utils/api";
import { TenderCard } from "./components/tender-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Layers, 
  SlidersHorizontal, 
  Building,
  Tag
} from "lucide-react";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CheckboxMUI from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";

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

function TendersContent() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pageSize, setPageSize] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // API Pagination state
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orgLocationKeyword, setOrgLocationKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchKeyword(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Sidebar Checkbox states
  const [orgGovt, setOrgGovt] = useState(false);
  const [orgNgo, setOrgNgo] = useState(false);
  
  const [sectorSolar, setSectorSolar] = useState(false);
  const [sectorWater, setSectorWater] = useState(false);
  const [sectorTransport, setSectorTransport] = useState(false);

  const [valUnder100, setValUnder100] = useState(false);
  const [val100to500, setVal100to500] = useState(false);
  const [valAbove500, setValAbove500] = useState(false);

  const tendersTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/tenders', {
          params: { 
            page: currentPage, 
            limit: pageSize,
            ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}),
            ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
          },
        });
        const data = response.data;
        
        const mappedTenders: Tender[] = (data.data || []).map((item: any) => ({
          id: item._id,
          title: item.title || "Untitled Tender",
          organization: item.organisation || item.authority_type || "Unknown Organization",
          deadline: item.deadline || item.publication_date || "Unknown Deadline",
          details: item.description || item.scope_of_work || "No details available",
          value: item.value || "Not Disclosed"
        }));
        
        setTenders(mappedTenders);
        if (data.pagination) {
          setTotalPages(Math.max(data.pagination.pages || 1, 1));
          setTotalResults(data.pagination.total || mappedTenders.length);
        } else {
          setTotalPages(1);
          setTotalResults(mappedTenders.length);
        }
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTenders();
  }, [currentPage, pageSize, searchKeyword, categoryFilter]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchKeyword("");
    setOrgLocationKeyword("");
    setCategoryFilter("all");
    setOrgGovt(false);
    setOrgNgo(false);
    setSectorSolar(false);
    setSectorWater(false);
    setSectorTransport(false);
    setValUnder100(false);
    setVal100to500(false);
    setValAbove500(false);
    setCurrentPage(1);
  };

  // Parse tender value for sorting (numeric representation in Crore INR)
  const getNumericValue = (valStr?: string): number => {
    if (!valStr || valStr === "Not Disclosed") return 0;
    const cleanStr = valStr.replace(/[₹$,]/g, "").toLowerCase();
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return 0;
    
    if (valStr.includes("$") && valStr.toLowerCase().includes("million")) {
      return num * 8.3; 
    }
    return num;
  };

  // Determine if a tender matches the active client refine filters
  const filteredTenders = tenders.filter((tender) => {
    // 1. Organization / Location search
    if (orgLocationKeyword.trim() !== "") {
      const orgKw = orgLocationKeyword.toLowerCase();
      if (!tender.organization.toLowerCase().includes(orgKw)) return false;
    }

    // 2. Organization Type Checkboxes (Government vs World Bank/NGO)
    const isGovtTender = tender.organization.toLowerCase().includes("govt") || 
                         tender.organization.toLowerCase().includes("ministry") ||
                         tender.organization.toLowerCase().includes("corporation") ||
                         tender.organization.toLowerCase().includes("department") ||
                         tender.organization.toLowerCase().includes("agency") ||
                         tender.organization.toLowerCase().includes("psu");
    const isNgoTender = tender.organization.toLowerCase().includes("world bank") || 
                        tender.organization.toLowerCase().includes("un ") || 
                        tender.organization.toLowerCase().includes("ngo") ||
                        tender.organization.toLowerCase().includes("atree") ||
                        tender.organization.toLowerCase().includes("trust");

    if (orgGovt || orgNgo) {
      let matchesOrg = false;
      if (orgGovt && isGovtTender) matchesOrg = true;
      if (orgNgo && isNgoTender) matchesOrg = true;
      if (!matchesOrg) return false;
    }

    // 3. Sector Checkboxes
    const matchesSolar = tender.title.toLowerCase().includes("solar") || tender.details.toLowerCase().includes("solar");
    const matchesWater = tender.title.toLowerCase().includes("river") || tender.title.toLowerCase().includes("water") || tender.details.toLowerCase().includes("remediation");
    const matchesTransport = tender.title.toLowerCase().includes("bus") || tender.title.toLowerCase().includes("transport") || tender.details.toLowerCase().includes("urban");

    if (sectorSolar || sectorWater || sectorTransport) {
      let matchesSector = false;
      if (sectorSolar && matchesSolar) matchesSector = true;
      if (sectorWater && matchesWater) matchesSector = true;
      if (sectorTransport && matchesTransport) matchesSector = true;
      if (!matchesSector) return false;
    }

    // 4. Value Range Checkboxes (in Crore INR)
    const numericValue = getNumericValue(tender.value); // in Crore
    if (valUnder100 || val100to500 || valAbove500) {
      let matchesValue = false;
      if (valUnder100 && numericValue > 0 && numericValue < 100) matchesValue = true;
      if (val100to500 && numericValue >= 100 && numericValue <= 500) matchesValue = true;
      if (valAbove500 && numericValue > 500) matchesValue = true;
      if (!matchesValue) return false;
    }

    return true;
  });

  // Sort filtered tenders
  const sortedTenders = [...filteredTenders].sort((a, b) => {
    if (sortBy === "value_desc") {
      return getNumericValue(b.value) - getNumericValue(a.value);
    }
    if (sortBy === "value_asc") {
      return getNumericValue(a.value) - getNumericValue(b.value);
    }
    return 0;
  });

  const displayedTenders = sortedTenders;
  const startIndex = (currentPage - 1) * pageSize;
  const currentCount = displayedTenders.length;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      tendersTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to determine active tag filters list
  const hasActiveFilters = 
    searchKeyword !== "" || 
    orgLocationKeyword !== "" || 
    categoryFilter !== "all" ||
    orgGovt || orgNgo || 
    sectorSolar || sectorWater || sectorTransport ||
    valUnder100 || val100to500 || valAbove500;

  return (
    <div className="w-full px-4 max-w-7xl mx-auto py-4">
      {/* Header / Breadcrumbs */}
      <div ref={tendersTopRef} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Environmental & ESG Tenders</h1>
            <p className="text-xs text-gray-500 mt-0.5">Explore active government, PSU, and multilateral sustainability bids</p>
          </div>
          <div className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-medium">Find Tenders</span>
          </div>
        </div>
      </div>

      {/* Premium Search Bar Panel */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-3 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Keyword Search */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Search className="h-4 w-4 text-gray-400 mr-2.5 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Tender title, keyword, or sector (e.g. Solar, Water, Waste)..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
            {searchKeyword && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1"
                onClick={() => { setSearchKeyword(""); setCurrentPage(1); }}
              />
            )}
          </div>

          {/* Org Search */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Building className="h-4 w-4 text-gray-400 mr-2.5 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Authority / Organization / Location..."
              value={orgLocationKeyword}
              onChange={(e) => {
                setOrgLocationKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
            {orgLocationKeyword && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1"
                onClick={() => { setOrgLocationKeyword(""); setCurrentPage(1); }}
              />
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Layers className="h-4 w-4 text-gray-400 mr-2.5 flex-shrink-0" />
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
                <SelectItem value="solar">Solar & Clean Energy</SelectItem>
                <SelectItem value="water">Water & Sanitation</SelectItem>
                <SelectItem value="transport">Electric Mobility & Transport</SelectItem>
                <SelectItem value="waste">Waste Management</SelectItem>
                <SelectItem value="forestry">Forestry & Biodiversity</SelectItem>
                <SelectItem value="hydrogen">Green Hydrogen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Toggle */}
          <div 
            onClick={handleResetFilters}
            className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors lg:mr-2"
            title="Reset Filters"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-600 select-none whitespace-nowrap">Reset</span>
          </div>
        </div>
      </div>

      {/* Active Filter Tags & Sorting Control Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Active Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {searchKeyword !== "" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Keyword: {searchKeyword}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setSearchKeyword(""); setCurrentPage(1); }} />
            </span>
          )}
          {orgLocationKeyword !== "" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Org/Location: {orgLocationKeyword}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setOrgLocationKeyword(""); setCurrentPage(1); }} />
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Sector: {categoryFilter}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setCategoryFilter("all"); setCurrentPage(1); }} />
            </span>
          )}
          {orgGovt && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Govt. Bodies
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setOrgGovt(false); setCurrentPage(1); }} />
            </span>
          )}
          {orgNgo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              World Bank/NGOs
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setOrgNgo(false); setCurrentPage(1); }} />
            </span>
          )}
          {sectorSolar && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Solar Energy
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setSectorSolar(false); setCurrentPage(1); }} />
            </span>
          )}
          {sectorWater && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Water Remediation
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setSectorWater(false); setCurrentPage(1); }} />
            </span>
          )}
          {sectorTransport && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Urban Transport
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setSectorTransport(false); setCurrentPage(1); }} />
            </span>
          )}
          {valUnder100 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Under ₹100 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setValUnder100(false); setCurrentPage(1); }} />
            </span>
          )}
          {val100to500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              ₹100 Cr - ₹500 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setVal100to500(false); setCurrentPage(1); }} />
            </span>
          )}
          {valAbove500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
              Above ₹500 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => { setValAbove500(false); setCurrentPage(1); }} />
            </span>
          )}
          {hasActiveFilters && (
            <button 
              onClick={handleResetFilters}
              className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold underline ml-1 self-center cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Dynamic sorting & page sizing */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select 
            value={sortBy} 
            onValueChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest Tenders</SelectItem>
              <SelectItem value="value_desc">Value: High to Low</SelectItem>
              <SelectItem value="value_asc">Value: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={pageSize.toString()} 
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[125px] h-9 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="15">15 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Layout (Sidebar + List) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Panel */}
        <Box className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-2xl h-fit py-2 shadow-2xs">
          {/* Organization Type */}
          <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
              <span className="font-semibold text-gray-900 text-sm">Authority Type</span>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={orgGovt} onChange={(e) => { setOrgGovt(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Government / PSU</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={orgNgo} onChange={(e) => { setOrgNgo(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">World Bank / NGOs</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            </AccordionDetails>
          </Accordion>

          {/* Sector Categories */}
          <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
              <span className="font-semibold text-gray-900 text-sm">Sectors</span>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={sectorSolar} onChange={(e) => { setSectorSolar(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Solar & Clean Energy</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={sectorWater} onChange={(e) => { setSectorWater(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Water Remediation</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={sectorTransport} onChange={(e) => { setSectorTransport(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Urban Green Transport</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            </AccordionDetails>
          </Accordion>

          {/* Tender Value Range */}
          <Accordion disableGutters elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, m: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}>
              <span className="font-semibold text-gray-900 text-sm">Tender Value</span>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={valUnder100} onChange={(e) => { setValUnder100(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Under ₹100 Crore</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={val100to500} onChange={(e) => { setVal100to500(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">₹100 Cr - ₹500 Crore</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
              <FormControlLabel
                control={<CheckboxMUI size="small" color="success" checked={valAbove500} onChange={(e) => { setValAbove500(e.target.checked); setCurrentPage(1); }} />}
                label={<span className="text-sm text-gray-600">Above ₹500 Crore</span>}
                sx={{ m: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Tender Listing Cards Block */}
        <div className="flex-grow bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
          {/* Header Row of Listing Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-5">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-bold text-gray-900">All Tenders & Bids</h2>
              <p className="text-xs text-gray-500 mt-1">
                {currentCount > 0
                  ? `Showing ${startIndex + 1}–${Math.min(startIndex + currentCount, totalResults)} of ${totalResults} tenders`
                  : "Showing 0 tenders"}
              </p>
            </div>
            
            {/* View Grid/List toggles */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'text-[#315D40] bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'text-[#315D40] bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid/List */}
          {isLoading ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#315D40] mb-4"></div>
              <p className="text-gray-500 text-sm">Loading tenders from server...</p>
            </div>
          ) : displayedTenders.length > 0 ? (
            <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {displayedTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-gray-700 font-bold text-base">No tenders found matching your filter criteria.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">Try clearing search terms or resetting authority and sector filters.</p>
              <Button onClick={handleResetFilters} className="mt-2 bg-[#315D40] hover:bg-[#254A32] text-white text-xs rounded-xl cursor-pointer">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Numbered Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 border-t border-gray-100 pt-6">
              <span className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2.5 text-xs text-gray-600 border-gray-200 disabled:opacity-40 rounded-lg cursor-pointer"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>

                {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">
                        ...
                      </span>
                    );
                  }

                  const pageNum = p as number;
                  const isCurrent = pageNum === currentPage;

                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrent ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#315D40] text-white hover:bg-[#254A32] shadow-2xs' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2.5 text-xs text-gray-600 border-gray-200 disabled:opacity-40 rounded-lg cursor-pointer"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TendersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading tenders directory...</div>}>
      <TendersContent />
    </Suspense>
  );
}
