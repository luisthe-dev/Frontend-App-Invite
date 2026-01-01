"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EventsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
        params.set('search', searchTerm);
    } else {
        params.delete('search');
    }
    router.push(`/events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search events (e.g., 'Music Festival')" 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-violet-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Location (e.g., 'New York')" 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>
      <button type="submit" className="px-8 py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
        Search
      </button>
    </form>
  );
}
