"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Simple utility if @/lib/utils is not yet created, I'll create it next.
// For now I'll assume standard tw-merge setup or inline it if I must. 
// Actually, I'll create the lib/utils first in the same turn to be safe.

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-violet-600 font-serif italic">
              Logo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
              Home
            </Link>
             <Link href="/about" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
              About
            </Link>
             <Link href="/events" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
              Events
            </Link>
             <Link href="/contact" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-violet-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
                 <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-violet-600">
                    Sign In
                 </Link>
                 <Link href="/signup" className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                    Get Started
                 </Link>
            </div>
             {/* 
            <button className="text-gray-600 hover:text-violet-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
             */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <button className="mr-4">
                <Search className="w-5 h-5 text-gray-600" />
             </button>
              <button className="mr-4 relative">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                 <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
             </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-violet-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute top-16 left-0 right-0 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
            >
              Home
            </Link>
             <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
            >
              About
            </Link>
             <Link 
                href="/events" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
            >
              Events
            </Link>
             <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
            >
              Contact
            </Link>
            
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link href="/signin" className="block w-full text-center px-4 py-3 font-medium text-gray-600 hover:text-violet-600 bg-gray-50 rounded-xl">
                    Sign In
                </Link>
                <Link href="/signup" className="block w-full text-center px-4 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200">
                    Get Started
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
