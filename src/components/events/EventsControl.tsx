"use client";

import { LayoutGrid, List, ChevronDown } from "lucide-react";

export default function EventsControl({ count = 0 }: { count?: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
      
      <p className="text-gray-500 text-sm">
        <span className="font-semibold text-gray-900">{count.toLocaleString()}</span> events found
      </p>

      <div className="flex items-center gap-4">
        {/* View Toggle */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
            <button className="p-1.5 rounded bg-white shadow-sm text-gray-900">
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded text-gray-400 hover:text-gray-600">
                <List className="w-4 h-4" />
            </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Date
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
        </div>
      </div>

    </div>
  );
}
