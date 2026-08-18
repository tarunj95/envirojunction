"use client";

import type { Tender } from "@/lib/types";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Building, Loader2, Sparkles, CheckCircle2, XCircle, AlertTriangle, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TenderCardProps {
  tender: Tender;
  viewMode?: "list" | "grid";
}

export function TenderCard({ tender, viewMode = "list" }: TenderCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const isList = viewMode === "list";

  return (
    <Card 
      className={cn(
        "bg-white transition-all duration-300 hover:shadow-xl border-2 border-gray-200 hover:border-[#1EC876] overflow-hidden",
        isList ? "w-full" : "h-full flex flex-col justify-between"
      )}
    >
      <CardContent className={cn("p-5 flex flex-col justify-between h-full gap-4")}>
        {/* Main Content Area */}
        <div className={cn("flex gap-4", isList ? "flex-col md:flex-row md:items-start" : "flex-col")}>
          
          {/* Left/Top: Organization Logo Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 border border-emerald-100 rounded-xl bg-emerald-50 text-[#315D40] font-bold text-xl uppercase select-none">
            {tender.organization.charAt(0)}
          </div>

          {/* Middle/Content Details */}
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 hover:text-emerald-700 transition-colors leading-snug truncate-title">
              <Link href={`/tenders/${tender.id}`}>
                {tender.title}
              </Link>
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate max-w-[240px]">{tender.organization}</span>
              </div>
            </div>

            <p className={cn("text-xs text-gray-500 leading-relaxed mt-2.5", isList ? "line-clamp-2" : "line-clamp-4")}>
              {tender.details}
            </p>

            {/* Badges / Meta Info */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant="secondary"
                className="bg-emerald-50 text-[#315D40] hover:bg-emerald-100 border border-emerald-100/50 rounded-full px-3 py-0.5 text-xs font-semibold flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tender.value}
              </Badge>
              
              <Badge 
                variant="outline" 
                className="rounded-full px-3 py-0.5 text-xs text-gray-500 border-gray-200 flex items-center gap-1 font-normal"
              >
                <Calendar className="h-3 w-3 text-gray-400" />
                Deadline: {tender.deadline}
              </Badge>
            </div>
          </div>

          {/* Right/Actions Box (Only in list view) */}
          {isList && (
            <div className="flex flex-row md:flex-col items-center justify-end gap-2 flex-shrink-0 w-full md:w-36 ml-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">


              <Button 
                variant={isSaved ? "default" : "outline"}
                onClick={() => setIsSaved(!isSaved)}
                className={cn(
                  "w-full h-9 text-xs font-semibold rounded-md shadow-none transition-colors flex items-center justify-center gap-1.5",
                  isSaved ? "bg-[#315D40] hover:bg-[#254A32] text-white" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                )}
              >
                <Bookmark className={cn("h-3.5 w-3.5", isSaved ? "fill-white" : "")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons (Only in grid view) */}
        {!isList && (
          <div className="flex gap-2 border-t border-gray-100 pt-4 mt-auto">


            <Button 
              variant={isSaved ? "default" : "outline"}
              onClick={() => setIsSaved(!isSaved)}
              className={cn(
                "h-9 px-3 text-xs font-semibold rounded-md shadow-none transition-colors flex items-center justify-center",
                isSaved ? "bg-[#315D40] hover:bg-[#254A32] text-white" : "border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
            >
              <Bookmark className={cn("h-3.5 w-3.5", isSaved ? "fill-white" : "")} />
            </Button>
          </div>
        )}


      </CardContent>
    </Card>
  );
}
