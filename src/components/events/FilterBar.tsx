"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "Music", "Business", "Food & Drink", "Arts", "Sports", "Technology", "Wellness"];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const updateCategory = (cat: string) => {
      const params = new URLSearchParams(searchParams);
      if (cat === 'All') {
          params.delete('category');
      } else {
          params.set('category', cat);
      }
      router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
        {CATEGORIES.map(cat => (
            <button 
                key={cat}
                onClick={() => updateCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    currentCategory === cat 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* Filter Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
    </div>
  );
}
