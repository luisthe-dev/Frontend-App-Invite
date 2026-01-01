"use client";

import { useState, useEffect } from "react";
import { hostApi } from "@/api/host";
import { Plus, Search, Filter, MoreVertical, Calendar, DollarSign, Users } from "lucide-react";
import Link from "next/link";

export default function MyEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await hostApi.getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch host events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your upcoming and past events.</p>
                    </div>
                     <Link href="/events/create" className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Create Event
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search events..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                    </div>
                     <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                            <option>All Statuses</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Ended</option>
                        </select>
                    </div>
                </div>

                {/* Events List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse"></div>)}
                    </div>
                ) : events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event) => (
                             <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:border-violet-100 transition-colors">
                                <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-violet-50 text-violet-300">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                         <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            event.status === 'published' ? 'bg-green-100 text-green-800' : 
                                            event.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                                         }`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                         </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(event.start_date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {event.tickets_count || 0} Sold</span>
                                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {event.revenue || '$0'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <Link href={`/events/${event.id}/edit`} className="flex-1 md:flex-none px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm text-center">
                                        Edit
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-violet-50 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                        <p className="text-gray-500 mt-2 mb-6">You haven't created any events yet.</p>
                        <Link href="/events/create" className="px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors">
                            Create API Event
                        </Link>
                    </div>
                )}

             </div>
        </div>
    );
}
