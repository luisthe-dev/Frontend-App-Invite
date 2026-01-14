"use client";
import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface EventsControlProps {
  count?: number;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export default function EventsControl({
  count = 0,
  view,
  setView,
}: EventsControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "date_asc";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
      <p className="text-gray-500 text-sm">
        <span className="font-semibold text-gray-900">
          {count.toLocaleString()}
        </span>{" "}
        events found
      </p>

      <div className="flex items-center gap-4">
        {/* View Toggle */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded shadow-sm transition-all ${
              view === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded shadow-sm transition-all ${
              view === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 relative">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Sort by:
          </span>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="appearance-none bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-100 cursor-pointer"
          >
            <option value="date_asc">Date (Earliest)</option>
            <option value="date_desc">Date (Latest)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
