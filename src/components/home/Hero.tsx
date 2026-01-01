"use client";

import Image from "next/image";
import { Search, MapPin, Calendar, CheckSquare } from "lucide-react";
import BackgroundImage from "@/assets/images/Background.png";

export default function Hero() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={BackgroundImage}
          alt="Concert Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/40 via-violet-900/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-md">
            Find Your Next <br className="hidden md:block" /> Experience
        </h1>
        <p className="text-white/90 text-sm md:text-lg mb-8 max-w-2xl mx-auto drop-shadow-sm">
          Discover thousands of events happening near you and around the world.
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-2 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="flex-1 w-full md:w-auto flex items-center px-4 h-12 border border-gray-100 md:border-0 md:border-r rounded-xl md:rounded-none bg-gray-50 md:bg-transparent">
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search Events..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Filters (Desktop) */}
          <div className="hidden md:flex items-center gap-4 px-4 h-12">
             <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">All Locations</span>
             </div>
             <div className="w-px h-8 bg-gray-100" />
             <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Any Date</span>
             </div>
              <div className="w-px h-8 bg-gray-100" />
             <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                <CheckSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">All Categories</span>
             </div>
          </div>

          {/* Search Button */}
          <button className="w-full md:w-auto min-w-[120px] bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-medium h-12 rounded-xl transition-all shadow-lg shadow-violet-200">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
