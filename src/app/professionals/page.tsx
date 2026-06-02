"use client";

import { useState } from "react";
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
import { Search, MapPin, X, Layers, SlidersHorizontal, RefreshCw } from "lucide-react";
import Link from "next/link";

const mockProfessionals = [
  {
    id: "1",
    name: "Ritika Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "2",
    name: "Rakesh Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
  {
    id: "3",
    name: "Niharika Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "4",
    name: "Naresh Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
  {
    id: "5",
    name: "Ritika Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "6",
    name: "Rakesh Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
  {
    id: "7",
    name: "Niharika Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "8",
    name: "Naresh Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
  {
    id: "9",
    name: "Ritika Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "10",
    name: "Rakesh Sharma",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
  {
    id: "11",
    name: "Niharika Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "female portrait",
  },
  {
    id: "12",
    name: "Naresh Singh",
    headline: "Product Designer",
    location: "Chandigarh, India",
    skills: ["Figma", "Adobe XD", "Application Design", "Remote"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    avatarHint: "male portrait",
  },
];

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [showDesignFilter, setShowDesignFilter] = useState(true);
  const [showChandigarhFilter, setShowChandigarhFilter] = useState(true);

  return (
    <div className="w-full px-4">
      {/* Header / Breadcrumb Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Professionals</h1>
          <div className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-medium">Find Professional</span>
          </div>
        </div>
      </div>

      {/* Search Bar Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Find a Professional"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full"
            />
          </div>

          {/* Location Input */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-base w-full"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex items-center px-3 py-1 border-b lg:border-b-0 lg:border-r border-gray-100 min-w-0">
            <Layers className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Select>
              <SelectTrigger className="border-0 focus:ring-0 shadow-none p-0 h-auto text-sm text-gray-500 bg-transparent w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="science">Environmental Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advance Filter */}
          <div className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-50 rounded transition-colors lg:mr-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-600 select-none whitespace-nowrap">Advance Filter</span>
          </div>

          {/* Search Button */}
          
          <Button className="bg-[#315D40] hover:bg-[#254A32] text-white px-7 py-2.5 h-auto text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
            Find Professionals
          </Button>
        </div>
      </div>

      {/* Filters and Sorting Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Active Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {showDesignFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 shadow-sm">
              Design
              <X 
                className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => setShowDesignFilter(false)}
              />
            </span>
          )}
          {showChandigarhFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 shadow-sm">
              Chandigarh
              <X 
                className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => setShowChandigarhFilter(false)}
              />
            </span>
          )}
        </div>

        {/* Sorting Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select defaultValue="latest">
            <SelectTrigger className="w-[130px] h-9 bg-white border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="12">
            <SelectTrigger className="w-[130px] h-9 bg-white border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-none">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Professionals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockProfessionals.map((prof) => (
          <ProfessionalCard 
            key={prof.id} 
            professional={prof} 
          />
        ))}
      </div>

      {/* Bottom loading / Load More button */}
      <div className="flex justify-center mt-12 mb-8">
        <button className="bg-[#315D40] hover:bg-[#19C26E] text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-semibold text-sm tracking-wide transition-colors shadow-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          View More
        </button>
      </div>
    </div>
  );
}
