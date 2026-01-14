"use client";

import Image from "next/image";
import { Search, MapPin, Calendar, CheckSquare } from "lucide-react";
import BackgroundImage from "@/assets/images/Background.png";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    date: "",
    category: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.location) params.set("location", filters.location);
    if (filters.date) params.set("date", filters.date);
    if (filters.category) params.set("category", filters.category);

    router.push(`/events?${params.toString()}`);
  };

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
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Filters (Desktop) */}
          <div className="hidden md:flex items-center gap-4 px-4 h-12">
            <div className="flex items-center gap-2 px-2 py-1 transition-colors min-w-[140px]">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Location"
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-600 font-medium w-full"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              />
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex items-center gap-2 px-2 py-1 transition-colors relative min-w-[140px]">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="date"
                className="bg-transparent border-none outline-none text-sm text-gray-700 font-medium w-full [&::-webkit-calendar-picker-indicator]:opacity-0 absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap truncate w-full pointer-events-none">
                {filters.date
                  ? new Date(filters.date).toLocaleDateString()
                  : "Any Date"}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex items-center gap-2 px-2 py-1 transition-colors relative min-w-[150px]">
              <CheckSquare className="w-4 h-4 text-gray-500 shrink-0" />
              <select
                className="bg-transparent border-none outline-none text-sm text-gray-700 font-medium w-full appearance-none absolute inset-0 opacity-0 cursor-pointer z-10"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Wellness">Wellness</option>
              </select>
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap truncate w-full pointer-events-none">
                {filters.category || "All Categories"}
              </span>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full md:w-auto min-w-[120px] bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-medium h-12 rounded-xl transition-all shadow-lg shadow-violet-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
