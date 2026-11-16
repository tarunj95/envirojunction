"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProfessionalCard } from "./components/professional-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, X, Layers, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import type { Professional } from "@/lib/types";

function ProfessionalsContent() {
  const searchParams = useSearchParams();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync search query parameter from URL (e.g. from header search)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users', {
          params: {
            ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
            ...(location.trim() ? { location: location.trim() } : {}),
          },
        });
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        const mappedProfessionals: Professional[] = data.map((user: any) => {
          let name = user.name;
          if (!name && user.firstName) {
            name = `${user.firstName} ${user.lastName || ''}`.trim();
          }
          if (!name) name = "Environmental Professional";

          // Safely resolve skills array
          let skillsArray: string[] = [];
          if (Array.isArray(user.professional_skills) && user.professional_skills.length > 0) {
            skillsArray = user.professional_skills;
          } else if (Array.isArray(user.skills) && user.skills.length > 0) {
            skillsArray = user.skills;
          } else if (typeof user.skills === 'string' && user.skills.trim()) {
            skillsArray = user.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
          } else if (Array.isArray(user.services) && user.services.length > 0) {
            skillsArray = user.services.map((s: any) => typeof s === 'string' ? s : s.title).filter(Boolean);
          }

          if (skillsArray.length === 0) {
            skillsArray = ["Sustainability", "Environmental Specialist"];
          }

          return {
            id: user.id?.toString() || user._id?.toString() || Math.random().toString(),
            name,
            headline: user.headline || user.title || user.role || user.jobTitle || "Environmental & Sustainability Professional",
            location: user.location || user.city || "India",
            skills: skillsArray,
            bio: user.about || user.headline || "Dedicated environmental practitioner focusing on ecological solutions and green transitions.",
            avatarUrl: user.avatar || user.avatarUrl || user.profilePicture || "",
            avatarHint: "user portrait",
          };
        });
        
        setProfessionals(mappedProfessionals);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [searchTerm, location]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocation("");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  // Filter professionals based on search, location, and specialization
  const filteredProfessionals = useMemo(() => {
    return professionals.filter((prof) => {
      // 1. Search term (matches name, headline, bio, or skills)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = prof.name.toLowerCase().includes(q);
        const matchesHeadline = prof.headline.toLowerCase().includes(q);
        const matchesBio = (prof.bio || "").toLowerCase().includes(q);
        const matchesSkills = (prof.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills) {
          return false;
        }
      }

      // 2. Location
      if (location.trim()) {
        const loc = location.toLowerCase();
        if (!prof.location.toLowerCase().includes(loc)) {
          return false;
        }
      }

      // 3. Specialization
      if (categoryFilter !== "all") {
        const cat = categoryFilter.toLowerCase();
        const matchesCat = 
          (prof.skills || []).some(s => s.toLowerCase().includes(cat) || cat.includes(s.toLowerCase())) ||
          prof.headline.toLowerCase().includes(cat) ||
          (prof.bio || "").toLowerCase().includes(cat);
        if (!matchesCat) return false;
      }

      return true;
    });
  }, [professionals, searchTerm, location, categoryFilter]);

  // Sort professionals
  const sortedProfessionals = useMemo(() => {
    if (sortBy === "oldest") {
      return [...filteredProfessionals].reverse();
    }
    return filteredProfessionals;
  }, [filteredProfessionals, sortBy]);

  // Client-side pagination
  const totalPages = Math.max(Math.ceil(sortedProfessionals.length / pageSize), 1);
  const paginatedProfessionals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProfessionals.slice(start, start + pageSize);
  }, [sortedProfessionals, currentPage, pageSize]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() !== "" || 
    location.trim() !== "" || 
    categoryFilter !== "all"
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header / Breadcrumb Section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Environmental Talent & Experts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Connect with researchers, policy experts, carbon accountants, and sustainability practitioners</p>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900 font-medium">Professionals</span>
        </div>
      </div>

      {/* Search Bar Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-2 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search by name, skill, or discipline..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
            {searchTerm && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" 
                onClick={() => { setSearchTerm(""); setCurrentPage(1); }} 
              />
            )}
          </div>

          {/* Location Input */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="City, State, or Country..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-sm w-full"
            />
            {location && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" 
                onClick={() => { setLocation(""); setCurrentPage(1); }} 
              />
            )}
          </div>

          {/* Discipline / Specialization Dropdown */}
          <div className="flex-1 flex items-center px-3 py-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Layers className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <Select 
              value={categoryFilter} 
              onValueChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-sm text-gray-600 bg-transparent w-full">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Policy">Environmental Policy</SelectItem>
                <SelectItem value="Renewable">Renewable Energy</SelectItem>
                <SelectItem value="Ecology">Ecology & Biodiversity</SelectItem>
                <SelectItem value="Sustainability">Sustainability & ESG</SelectItem>
                <SelectItem value="Water">Water & Sanitation</SelectItem>
                <SelectItem value="GIS">GIS & Remote Sensing</SelectItem>
                <SelectItem value="Carbon">Carbon Accounting</SelectItem>
                <SelectItem value="Audit">Environmental Audits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Toggle */}
          <div 
            onClick={handleResetFilters}
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-500 mr-1.5" />
            <span className="text-sm font-medium text-gray-600">Reset</span>
          </div>

          {/* Search Action Button */}
          <Button 
            onClick={() => setCurrentPage(1)}
            className="bg-[#315D40] hover:bg-[#254A32] text-white px-7 py-2 h-auto text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            Find Professionals
          </Button>
        </div>
      </div>

      {/* Dynamic Active Filter Tags Row & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
              Keyword: {searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" 
                onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
              />
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
              Location: {location}
              <X 
                className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" 
                onClick={() => { setLocation(""); setCurrentPage(1); }}
              />
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-xs">
              Specialization: {categoryFilter}
              <X 
                className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" 
                onClick={() => { setCategoryFilter("all"); setCurrentPage(1); }}
              />
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#315D40] hover:text-[#254A32] font-semibold underline ml-1 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Sorting & Page Size Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px] h-9 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-none">
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
            <SelectTrigger className="w-[120px] h-9 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-medium">
          Showing {sortedProfessionals.length} {sortedProfessionals.length === 1 ? 'professional' : 'professionals'}
        </p>
      </div>

      {/* Professionals Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-[#315D40] animate-spin" />
        </div>
      ) : paginatedProfessionals.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-8">
          <p className="text-gray-500 font-medium text-base">No environmental professionals found matching your filters.</p>
          <Button 
            onClick={handleResetFilters} 
            className="mt-4 bg-[#315D40] hover:bg-[#254A32] text-white text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedProfessionals.map((prof) => (
            <ProfessionalCard 
              key={prof.id} 
              professional={prof} 
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-gray-600 rounded-lg border-gray-200"
            onClick={() => {
              setCurrentPage(p => Math.max(p - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                currentPage === page 
                  ? 'bg-[#315D40] text-white hover:bg-[#254A32] hover:text-white shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-gray-600 rounded-lg border-gray-200"
            onClick={() => {
              setCurrentPage(p => Math.min(p + 1, totalPages));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading professionals directory...</div>}>
      <ProfessionalsContent />
    </Suspense>
  );
}
