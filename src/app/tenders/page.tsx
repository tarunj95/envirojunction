"use client";

import { useState } from "react";
import { tenders } from "@/lib/data";
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

export default function TendersPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("latest");

  // Search States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orgLocationKeyword, setOrgLocationKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Sidebar Checkbox states
  const [orgGovt, setOrgGovt] = useState(false);
  const [orgNgo, setOrgNgo] = useState(false);
  
  const [sectorSolar, setSectorSolar] = useState(false);
  const [sectorWater, setSectorWater] = useState(false);
  const [sectorTransport, setSectorTransport] = useState(false);

  const [valUnder100, setValUnder100] = useState(false);
  const [val100to500, setVal100to500] = useState(false);
  const [valAbove500, setValAbove500] = useState(false);

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
  const getNumericValue = (valStr: string): number => {
    const cleanStr = valStr.replace(/[₹$,]/g, "").toLowerCase();
    const num = parseFloat(cleanStr);
    
    if (valStr.includes("$") && valStr.toLowerCase().includes("million")) {
      // $300 Million -> approx ₹2500 Crore (using 1 Million USD ~ 8.3 Crore INR, or roughly 300 * 8.3 / 10 = ~250 Crore INR)
      return num * 8.3; 
    }
    if (valStr.includes("₹") && valStr.toLowerCase().includes("crore")) {
      return num;
    }
    return num;
  };

  // Determine if a tender matches the active filters
  const filteredTenders = tenders.filter((tender) => {
    // 1. Keyword search (Title or details)
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.toLowerCase();
      const titleMatch = tender.title.toLowerCase().includes(kw);
      const detailsMatch = tender.details.toLowerCase().includes(kw);
      if (!titleMatch && !detailsMatch) return false;
    }

    // 2. Organization / Location search
    if (orgLocationKeyword.trim() !== "") {
      const orgKw = orgLocationKeyword.toLowerCase();
      if (!tender.organization.toLowerCase().includes(orgKw)) return false;
    }

    // 3. Category selector dropdown
    if (categoryFilter !== "all") {
      const cat = categoryFilter.toLowerCase();
      if (cat === "solar" && !tender.title.toLowerCase().includes("solar")) return false;
      if (cat === "water" && !tender.title.toLowerCase().includes("river") && !tender.title.toLowerCase().includes("water")) return false;
      if (cat === "transport" && !tender.title.toLowerCase().includes("bus") && !tender.title.toLowerCase().includes("transport")) return false;
    }

    // 4. Organization Type Checkboxes (Government vs World Bank/NGO)
    const isGovtTender = tender.organization.toLowerCase().includes("govt") || 
                         tender.organization.toLowerCase().includes("ministry") ||
                         tender.organization.toLowerCase().includes("corporation");
    const isNgoTender = tender.organization.toLowerCase().includes("world bank") || 
                        tender.organization.toLowerCase().includes("un ") || 
                        tender.organization.toLowerCase().includes("ngo");

    if (orgGovt || orgNgo) {
      let matchesOrg = false;
      if (orgGovt && isGovtTender) matchesOrg = true;
      if (orgNgo && isNgoTender) matchesOrg = true;
      if (!matchesOrg) return false;
    }

    // 5. Sector Checkboxes
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

    // 6. Value Range Checkboxes (in Crore INR)
    const numericValue = getNumericValue(tender.value); // in Crore
    if (valUnder100 || val100to500 || valAbove500) {
      let matchesValue = false;
      if (valUnder100 && numericValue < 100) matchesValue = true;
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
    // "latest" default (mocked by array index or ID)
    return parseInt(b.id) - parseInt(a.id);
  });

  // Pagination calculation
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedTenders = sortedTenders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedTenders.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
    <div className="w-full px-4">
      {/* Header / Breadcrumbs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Find Tenders</h1>
          <div className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-medium">Find Tenders</span>
          </div>
        </div>
      </div>

      {/* Premium Search Bar Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          {/* Keyword Search */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Tender title, keyword, or sector"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
          </div>

          {/* Org Search */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Building className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Authority / Organization"
              value={orgLocationKeyword}
              onChange={(e) => {
                setOrgLocationKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Layers className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Select 
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-sm text-gray-500 bg-transparent w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="solar">Solar & Renewables</SelectItem>
                <SelectItem value="water">Water & Remediation</SelectItem>
                <SelectItem value="transport">Urban Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advance Filter Toggle/Indicator */}
          <div 
            onClick={handleResetFilters}
            className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-50 rounded transition-colors lg:mr-2"
            title="Reset Filters"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-600 select-none whitespace-nowrap">Reset Filters</span>
          </div>

          {/* Search Action Button */}
          <Button className="bg-[#315D40] hover:bg-[#254A32] text-white px-7 py-2.5 h-auto text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
            Search Tenders
          </Button>
        </div>
      </div>

      {/* Active Filter Tags & Sorting Control Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Active Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {searchKeyword !== "" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Keyword: {searchKeyword}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSearchKeyword("")} />
            </span>
          )}
          {orgLocationKeyword !== "" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Organization: {orgLocationKeyword}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setOrgLocationKeyword("")} />
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Category: {categoryFilter === "solar" ? "Solar" : categoryFilter === "water" ? "Water" : "Transport"}
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setCategoryFilter("all")} />
            </span>
          )}
          {orgGovt && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Govt. Bodies
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setOrgGovt(false)} />
            </span>
          )}
          {orgNgo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              World Bank/NGOs
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setOrgNgo(false)} />
            </span>
          )}
          {sectorSolar && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Solar Energy
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSectorSolar(false)} />
            </span>
          )}
          {sectorWater && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Water & River cleaning
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSectorWater(false)} />
            </span>
          )}
          {sectorTransport && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Urban Transport
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSectorTransport(false)} />
            </span>
          )}
          {valUnder100 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Under ₹100 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setValUnder100(false)} />
            </span>
          )}
          {val100to500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              ₹100 Cr - ₹500 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setVal100to500(false)} />
            </span>
          )}
          {valAbove500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
              Above ₹500 Cr
              <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setValAbove500(false)} />
            </span>
          )}
          {hasActiveFilters && (
            <button 
              onClick={handleResetFilters}
              className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold underline ml-1 self-center"
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
            <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Layout (Sidebar + List) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Panel */}
        <Box className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg h-fit py-2">
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
        <div className="flex-grow bg-white rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Header Row of Listing Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">All Tenders & Bids</h2>
              <p className="text-sm text-gray-500 mt-1">
                {sortedTenders.length > 0
                  ? `Showing ${startIndex + 1}–${Math.min(endIndex, sortedTenders.length)} of ${sortedTenders.length} results`
                  : "Showing 0 results"}
              </p>
            </div>
            
            {/* View Grid/List toggles */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                title="Grid view"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-900 bg-gray-50'}`}
                title="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cards Grid/List */}
          {displayedTenders.length > 0 ? (
            <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {displayedTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tenders found matching your filter criteria.</p>
              <Button onClick={handleResetFilters} className="mt-4 bg-[#315D40] hover:bg-[#254A32] text-white">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 border-t border-gray-100 pt-6">
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
                  className={`h-8 w-8 transition-colors ${
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
  );
}
