"use client";

import EventCard from "@/components/ui/EventCard";
import { eventsApi } from "@/api/events";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency, getPriceRange } from "@/lib/utils";

const FALLBACK_EVENTS = [
  {
    id: "1",
    title: "Comedy Night with John Mulaney",
    location: "Comedy Cellar, New York",
    date: "2025-10-14",
    time: "7:00 PM",
    priceRange: "$45 - $75",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "2",
    title: "NBA Finals 2025",
    location: "Madison Square Garden, NY",
    date: "2025-10-16",
    time: "8:30 PM",
    priceRange: "$120 - $350",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
  },
   {
    id: "3",
    title: "Music Festival",
    location: "Downtown Las Vegas, NV",
    date: "2025-11-22",
    time: "5:00 PM",
    priceRange: "₦50 - ₦150",
    category: "Music",
    image: "https://images.unsplash.com/photo-1459749411177-287ce63e3ba0?auto=format&fit=crop&q=80&w=1000"
  }
];

export default function FeaturedEvents() {
    const [events, setEvents] = useState<any[]>(FALLBACK_EVENTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventsApi.getFeatured();
                if (data && data.length > 0) {
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured events:", error);
                // Keep fallback
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
        <div className="flex items-center gap-2">
            <Link href="/events" className="text-violet-600 font-medium hover:underline text-sm mr-4">View All</Link>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
             <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
            <EventCard 
                key={event.id} 
                id={event.id}
                slug={event.slug}
                title={event.title}
                location={event.location ?? 'Online'}
                date={event.start_date || event.date}
                priceRange={getPriceRange(event)}
                category={event.category}
                image={event.image_url || event.image || "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=1000"}
            />
            ))}
        </div>
      )}
    </section>
  );
}
