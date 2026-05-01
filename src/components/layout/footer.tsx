"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo and Description */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="EnviroJunction Logo" className="h-10 w-auto" />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Discover the vibrant hub at Enviro Junction, where nature and community thrive together harmoniously.
          </p>
        </div>

        {/* General Information */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm">General information</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Community Rules</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Terms</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Sales Solutions</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Security Center</Link></li>
          </ul>
        </div>

        {/* Special Abilities */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm">Special abilities</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Career</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Advertising Preferences</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Mobile applications</Link></li>
          </ul>
        </div>

        {/* Hiring Solutions */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm">Hiring Solutions</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Marketing Solutions</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Advertising</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-green-600 text-sm">Small business</Link></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm">Follow us</h4>
          <div className="flex gap-4">
            <Link href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-green-600 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-green-600 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-green-600 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-green-600 hover:text-white transition-colors">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
