"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventsSearch from "@/components/events/EventsSearch";
import FilterBar from "@/components/events/FilterBar";
import EventsControl from "@/components/events/EventsControl";
import EventCard from "@/components/ui/EventCard";
import { eventsApi } from "@/api/events";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getPriceRange } from "@/lib/utils";

// Suspense wrapper component
function EventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        date: searchParams.get("date") || "",
        location: searchParams.get("location") || "",
        sort: searchParams.get("sort") || "date_asc",
        page: 1, // TODO: Add pagination support
      };

      const data = await eventsApi.getAll(params);
      // API returns paginated response: { current_page, data: [], total, ... }
      setEvents(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Section */}
      <div className="mb-8 mt-4">
        <EventsSearch />
      </div>

      {/* Filters & Tags */}
      <div className="mb-8">
        <FilterBar />
      </div>

      {/* Controls (Count & Sort & View) */}
      <div className="mb-6">
        <EventsControl count={total} view={view} setView={setView} />
      </div>

      {/* Events Grid/List */}
      {loading ? (
        <div
          className={`grid gap-8 ${
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`bg-gray-100 rounded-2xl animate-pulse ${
                view === "grid" ? "h-96" : "h-48"
              }`}
            ></div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div
          className={`grid gap-8 ${
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              slug={event.slug}
              title={event.title}
              location={event.location || "TBA"}
              date={event.start_date}
              priceRange={getPriceRange(event)}
              category={event.category}
              image={
                event.image_url ||
                event.image ||
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000"
              }
              className={view === "list" ? "flex-row" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Load More */}
      {events.length > 0 && events.length < total && (
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm">
            Load More Events
          </button>
        </div>
      )}
    </main>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}>
        <EventsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
