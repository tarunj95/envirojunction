"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tenders } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Clock, 
  Lock, 
  Shield, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  MapPin, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  Globe, 
  ArrowUpRight, 
  Check,
  Briefcase,
  FileText,
  Tag,
  Layers,
  Award,
  Search,
  Eye,
  Info,
  SlidersHorizontal,
  Compass,
  Building2,
  FolderLock
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TenderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [isSaved, setIsSaved] = useState(false);

  // Find current tender
  const tender = tenders.find((t) => t.id === id);

  // If tender not found
  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-display">Tender Not Found</h2>
        <p className="text-gray-505 mb-6 max-w-md text-sm">
          We couldn't find the tender posting you're looking for. It may have been closed or removed.
        </p>
        <Link href="/tenders">
          <Button className="bg-[#315D40] hover:bg-[#254A32] text-white rounded-xl">
            Back to Tenders Directory
          </Button>
        </Link>
      </div>
    );
  }

  const isENTTender = tender.id === "4";

  // Dynamic Fields populated from the exact screenshot data
  const title = tender.title;
  const organization = tender.organization;
  const tenderID = isENTTender ? "2026_AIIMN_907188_1" : `2024_${tender.organization.substring(0, 5).replace(/[^a-zA-Z]/g, "").toUpperCase()}_${tender.id}0839_1`;
  const referenceNumber = isENTTender ? "AIIMS-NAG/PMJAY/ENTC/OTE/26/01" : `${tender.organization.substring(0, 5).replace(/[^a-zA-Z]/g, "").toUpperCase()}/OTE/${tender.id}6/01`;
  const tenderType = isENTTender ? "Open Tender (Supply)" : "Open Tender";

  const tenderFee = "₹0.00 (Exempted: No)";
  const emdAmount = isENTTender ? "₹50,000 (Fixed)" : `${tender.value} (Fixed)`;
  const emdPayableTo = isENTTender ? "Director AIIMS Nagpur" : `Director, ${tender.organization}`;
  const paymentInstruments = "Demand Draft, FDR, Bankers Cheque, Bank Guarantee";

  const publishedDate = isENTTender ? "02-May-2026 05:00 PM" : "01-Jul-2024 10:00 AM";
  const submissionEndDate = isENTTender ? "30-May-2026 03:00 PM" : `${tender.deadline} 03:00 PM`;
  const bidOpeningDate = isENTTender ? "01-Jun-2026 03:30 PM" : "02-Oct-2024 03:30 PM"; // dynamic fallback
  const docDownloadEndDate = isENTTender ? "30-May-2026 03:00 PM" : `${tender.deadline} 03:00 PM`;

  const productCategory = "₹0.00 (Exempted: No)"; // matches the mockup duplication
  const contractType = emdAmount; // matches the mockup duplication
  const periodOfWork = emdPayableTo; // matches the mockup duplication
  const bidValidity = paymentInstruments; // matches the mockup duplication

  const covers = "2 (Fee/PreQual/Technical & Finance)";
  const withdrawalAllowed = "Yes";
  const ndaRequired = "No";

  const contactName = isENTTender ? "Director, AIIMS Nagpur" : `Director, ${tender.organization}`;
  const contactAddress = isENTTender ? "Mihan, Nagpur - 441108" : `123 Sector 12, Chandigarh, India`;
  const contactPhone = isENTTender ? "0712-2352000" : "(123) 456-7890";
  const contactEmail = isENTTender ? "procurement@aiimsnagpur.edu.in" : `procurement@${tender.organization.substring(0, 5).replace(/[^a-zA-Z]/g, "").toLowerCase()}.gov.in`;

  // Detailed Description template matching the mockup exactly
  const welcomeTitle = "Welcome to Echo Thems";
  const welcomeText = "Echo Thems is committed to fostering a vibrant work culture that prioritizes environmental sustainability. Their team thrives in a collaborative atmosphere where innovation meets responsibility. Employees are encouraged to share ideas that contribute to eco-friendly practices, making every project a step towards a greener future. With flexible work arrangements and a focus on well-being, Echo Thems empowers its workforce to balance productivity with a passion for protecting the planet.";
  
  const essentialSkills = [
    "A portfolio demonstrating well thought through and polished end-to-end user journeys",
    "5+ years of industry experience in interactive design and / or visual design",
    "Excellent interpersonal skills",
    "Aware of trends in mobile, communications, and collaboration",
    "Ability to create highly polished design prototypes, mockups, and other communication artifacts",
    "The ability to scope and estimate efforts accurately and prioritize tasks and goals independently",
    "History of impacting shipping products with your work",
    "A Bachelor's degree in Design (or related field) or equivalent professional experience",
    "Proficiency in a variety of design tools such as Figma, Photoshop, Illustrator, and Sketch"
  ];

  const preferredExperience = [
    "Designing user experiences for enterprise software / services",
    "Creating and applying established design principles and interaction patterns",
    "Aligning or influencing design thinking with teams working in other geographies"
  ];

  // Similar Tenders Sidebar Data
  const similarTenders = [
    { id: "s1", title: "NM-TJAY", type: "Fulltime", time: "2 mins ago", loc: "New Delhi, Ind", color: "bg-[#5C6BC0]" },
    { id: "s2", title: "Echo Network", type: "Fulltime", time: "2 mins ago", loc: "Dhi, Ind", color: "bg-[#FF7043]" },
    { id: "s3", title: "For Echs", type: "Fulltime", time: "4 mins ago", loc: "Glasgow, Ind", color: "bg-[#66BB6A]" },
    { id: "s4", title: "NM-TJAY", type: "Fulltime", time: "2 mins ago", loc: "New Delhi, Ind", color: "bg-[#5C6BC0]" },
    { id: "s5", title: "Echo Network", type: "Fulltime", time: "2 mins ago", loc: "Dhi, Ind", color: "bg-[#FF7043]" },
    { id: "s6", title: "For Echs", type: "Fulltime", time: "4 mins ago", loc: "Glasgow, Ind", color: "bg-[#66BB6A]" },
    { id: "s7", title: "NM-TJAY", type: "Fulltime", time: "2 mins ago", loc: "New Delhi, Ind", color: "bg-[#5C6BC0]" },
    { id: "s8", title: "Echo Network", type: "Fulltime", time: "2 mins ago", loc: "Dhi, Ind", color: "bg-[#FF7043]" },
    { id: "s9", title: "For Echs", type: "Fulltime", time: "4 mins ago", loc: "Glasgow, Ind", color: "bg-[#66BB6A]" },
    { id: "s10", title: "NM-TJAY", type: "Fulltime", time: "2 mins ago", loc: "New Delhi, Ind", color: "bg-[#5C6BC0]" },
    { id: "s11", title: "Echo Network", type: "Fulltime", time: "2 mins ago", loc: "Dhi, Ind", color: "bg-[#FF7043]" }
  ];

  // Featured Tenders Section
  const featuredTenders = [
    {
      id: "f1",
      company: "Dailymotion",
      location: "New Delhi, Ind",
      title: "Frontend Developer",
      time: "5 minutes ago",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.",
      skills: ["Figma", "Adobe XD"],
      tags: ["Application Design", "Remote"],
      color: "bg-[#FF5A00]"
    },
    {
      id: "f2",
      company: "Dailymotion",
      location: "New Delhi, Ind",
      title: "Frontend Developer",
      time: "5 minutes ago",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.",
      skills: ["Figma", "Adobe XD"],
      tags: ["Application Design", "Remote"],
      color: "bg-[#5C6BC0]"
    },
    {
      id: "f3",
      company: "Dailymotion",
      location: "New Delhi, Ind",
      title: "Frontend Developer",
      time: "5 minutes ago",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.",
      skills: ["Figma", "Adobe XD"],
      tags: ["Application Design", "Remote"],
      color: "bg-[#FF5A00]"
    },
    {
      id: "f4",
      company: "Dailymotion",
      location: "New Delhi, Ind",
      title: "Frontend Developer",
      time: "5 minutes ago",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.",
      skills: ["Figma", "Adobe XD"],
      tags: ["Application Design", "Remote"],
      color: "bg-[#66BB6A]"
    }
  ];

  return (
    <div className="w-full space-y-8 bg-[#F7F9FB] -mt-6 -mx-4 px-4 py-8 md:-mx-8 md:px-8">
      {/* Title Header Card */}
      <div className="bg-white border border-gray-200/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-4 max-w-3xl">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to directory</span>
          </button>
          
          <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-950 leading-tight tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-gray-400" />
              Fulltime
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-400" />
              3 Days ago
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 self-stretch md:self-auto flex items-center gap-3">
          <Button 
            className="bg-[#315D40] hover:bg-[#254A32] text-white font-semibold px-6 py-2.5 h-11 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm"
          >
            <span className="tracking-wide">Apply now</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Details & Description Cards) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tender Information Metadata Details Card */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
            <h2 className="text-[#315D40] text-xl font-bold tracking-tight pb-3 border-b border-gray-100">
              Tender Information
            </h2>

            {/* Row 1: Core Metadata & Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
              {/* Core Metadata */}
              <div className="space-y-5">
                <h3 className="text-gray-900 font-bold text-base tracking-tight mb-4">Core Metadata</h3>
                
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Building className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Organization</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 break-words">{organization}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Tender ID</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{tenderID}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Reference Number</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{referenceNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Type</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{tenderType}</p>
                  </div>
                </div>
              </div>

              {/* Financial KPIs */}
              <div className="space-y-5">
                <h3 className="text-gray-900 font-bold text-base tracking-tight mb-4">Financial KPIs</h3>
                
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Tender Fee</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{tenderFee}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">EMD Amount</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{emdAmount}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">EMD Payable To</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{emdPayableTo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Payment Instruments</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 leading-snug">{paymentInstruments}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Critical Timeline & Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
              {/* Critical Timeline */}
              <div className="space-y-5">
                <h3 className="text-gray-900 font-bold text-base tracking-tight mb-4">Critical Timeline</h3>
                
                {/* Custom Timeline Layout */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-100">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#1EC876] border-2 border-white shadow-sm flex items-center justify-center"></span>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Published</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{publishedDate}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#1EC876] shadow-sm flex items-center justify-center"></span>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Submission End</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{submissionEndDate}</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#1EC876] shadow-sm flex items-center justify-center"></span>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Bid Opening</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{bidOpeningDate}</p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#1EC876] shadow-sm flex items-center justify-center"></span>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Document Download End</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{docDownloadEndDate}</p>
                  </div>
                </div>
              </div>

              {/* Work Details */}
              <div className="space-y-5">
                <h3 className="text-gray-900 font-bold text-base tracking-tight mb-4">Work Details</h3>
                
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Product Category</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{productCategory}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Contract Type</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{contractType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Period of Work</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{periodOfWork}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Bid Validity</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 leading-snug">{bidValidity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Technical Requirements */}
            <div className="space-y-5">
              <h3 className="text-gray-900 font-bold text-base tracking-tight mb-4">Technical Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Covers</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 leading-relaxed">{covers}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Withdrawal Allowed</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{withdrawalAllowed}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl flex-shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">NDA Required</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{ndaRequired}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Welcome and Detailed Text Card ("Welcome to Echo Themes") */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">{welcomeTitle}</h2>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                {welcomeText}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Essential Knowledge, Skills, and Experience</h3>
              <ul className="space-y-2.5">
                {essentialSkills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2"></span>
                    <span className="leading-relaxed">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Preferred Experience</h3>
              <ul className="space-y-2.5">
                {preferredExperience.map((exp, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2"></span>
                    <span className="leading-relaxed">{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Heading 4</h3>
              <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  <strong className="text-gray-900 font-semibold">Product knowledge:</strong> Deeply understand the technology and features of the product area to which you are assigned.
                </p>
                <p>
                  <strong className="text-gray-900 font-semibold">Research:</strong> Provide human and business impact and insights for products.
                </p>
              </div>
            </div>

            <div className="text-gray-400 text-sm italic font-medium pt-2">
              -- Echo Themes --
            </div>

            {/* Bottom Actions Row inside card */}
            <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-[#315D40] hover:bg-[#254A32] text-white font-semibold px-6 py-2 h-10 rounded-xl text-sm"
                >
                  Apply now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`h-10 px-5 rounded-xl text-sm font-semibold border-gray-200 transition-all ${
                    isSaved ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {isSaved ? "Saved" : "Save job"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400">Share this:</span>
                <div className="flex items-center gap-1.5">
                  <a href="#" className="h-8 w-8 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          
          {/* Echo Themes Info Card (Map + Address details) */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#315D40] font-bold text-lg flex items-center justify-center uppercase select-none">
                E
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base leading-tight">Echo Themes</h3>
                <p className="text-sm text-gray-400 mt-0.5 font-medium">Chandigarh, India</p>
              </div>
            </div>

            {/* Custom Interactive Map Component */}
            <div className="relative w-full h-36 bg-[#E3F2FD] rounded-2xl border border-[#90CAF9]/40 overflow-hidden shadow-inner select-none">
              {/* SVG Vector roads grid */}
              <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                {/* Highways and secondary streets */}
                <path d="M-20 40 L320 40" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M-20 40 L320 40" stroke="#90CAF9" strokeWidth="2.5" strokeLinecap="round" />
                
                <path d="M120 -10 L120 180" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
                <path d="M120 -10 L120 180" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" />

                <path d="M40 -10 L180 150" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                <path d="M40 -10 L180 150" stroke="#BBDEFB" strokeWidth="1.5" strokeLinecap="round" />
                
                <path d="M180 30 Q 220 50 250 120" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M180 30 Q 220 50 250 120" stroke="#BBDEFB" strokeWidth="1.5" fill="none" />
              </svg>
              
              {/* Highway Shield Icon Label */}
              <div className="absolute top-8 right-12 bg-[#1565C0] text-white text-[8px] font-bold px-1 py-0.5 rounded border border-white flex items-center justify-center shadow-sm">
                A9
              </div>

              {/* Map labels */}
              <div className="absolute top-2 left-4 text-[8px] text-[#546E7A] font-bold select-none uppercase tracking-wide opacity-80">
                a Maria
              </div>
              <div className="absolute bottom-6 right-8 text-[8px] text-[#546E7A] font-bold select-none uppercase tracking-wide opacity-80">
                Caneças
              </div>
              
              {/* Blue active route path line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 120 100 L 120 40 L 200 40" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
              </svg>

              {/* Location Marker with pulsing animation */}
              <div className="absolute top-[40px] left-[120px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute inline-flex h-5 w-5 rounded-full bg-[#1EC876]/45 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1EC876] border-2 border-white shadow-md"></span>
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-2 text-sm text-gray-500 font-medium leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>123 Sector 12, Chandigarh, 160017, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span>contact@echothemes.com</span>
              </p>
            </div>
          </div>

          {/* Contact Section Panel */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#315D40] text-sm tracking-tight border-b border-gray-100 pb-3 uppercase">
              Technical Contact
            </h3>
            
            <div className="space-y-4 text-sm text-gray-500 font-medium leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="bg-gray-50 text-gray-400 p-1.5 rounded-lg flex-shrink-0">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Authority</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{contactName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="bg-gray-50 text-gray-400 p-1.5 rounded-lg flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Address</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{contactAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="bg-gray-50 text-gray-400 p-1.5 rounded-lg flex-shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Phone</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="bg-gray-50 text-gray-400 p-1.5 rounded-lg flex-shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none">Email</p>
                  <a href={`mailto:${contactEmail}`} className="text-sm font-medium text-emerald-700 hover:underline mt-1 block break-all">
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Tenders List Panel */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm tracking-tight border-b border-gray-100 pb-3">
              Similar Tenders
            </h3>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {similarTenders.map((sim, index) => (
                <div key={index} className="flex gap-3 items-start group cursor-pointer hover:bg-gray-50/50 p-1.5 rounded-xl transition-all">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${sim.color} font-bold text-xs uppercase shadow-sm select-none`}>
                    {sim.title.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors truncate">
                      {sim.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {sim.type} • {sim.time} • {sim.loc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Full-Width Featured Tenders Section */}
      <div className="space-y-6 pt-6 border-t border-gray-200/60">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Featured Tenders</h2>
          <p className="text-sm text-gray-400 font-medium">Get the latest news, updates and tips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTenders.map((feat) => (
            <Card key={feat.id} className="transition-all duration-300 hover:shadow-lg border-2 border-gray-200/60 hover:border-emerald-400 rounded-3xl overflow-hidden bg-white flex flex-col justify-between">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                {/* Header Info */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5 items-center min-w-0">
                    <div className={`h-8 w-8 rounded-xl ${feat.color} flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm`}>
                      D
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate leading-none">{feat.company}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{feat.location}</p>
                    </div>
                  </div>

                  <span className="h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                </div>

                {/* Body Content */}
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight">{feat.title}</h3>
                  <p className="text-xs text-gray-400 font-medium">{feat.time}</p>
                  <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">
                    {feat.desc}
                  </p>
                </div>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {feat.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-50 text-xs font-medium text-gray-500 rounded-md border border-gray-200/50">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Bottom details & Button */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {feat.tags.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-emerald-50 text-xs font-medium text-emerald-800 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Button 
                    variant="secondary"
                    className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-lg flex-shrink-0 shadow-none border-0"
                  >
                    View More
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Centered Big Green Action Button */}
        <div className="flex justify-center pt-2">
          <Button 
            className="bg-[#1EC876] hover:bg-[#15A65E] text-white font-bold h-10 px-8 rounded-full flex items-center gap-2 shadow-md transition-all text-xs"
          >
            <span>View More</span>
            <Check className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

    </div>
  );
}
