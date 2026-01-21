import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Calendar, MapPin, Users, MoreVertical } from "lucide-react";

interface Event {
    id: number;
    title: string;
    start_date: string;
    location: string;
    tickets_sold: number;
    capacity: number;
    status: string;
    slug: string;
}

interface UpcomingEventsProps {
    events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    // Take only first 5 events
    const displayEvents = events.slice(0, 5);

    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                <Link href="/dashboard/events" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                    View All
                </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
                {displayEvents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>No upcoming events defined.</p>
                    </div>
                ) : (
                    displayEvents.map((event) => (
                        <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-violet-100 flex flex-col items-center justify-center text-violet-700 flex-shrink-0">
                                    <span className="text-xs font-semibold uppercase">
                                        {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold leading-none">
                                        {new Date(event.start_date).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="max-w-[150px] truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>{event.tickets_sold} / {event.capacity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    event.status === 'published' ? 'bg-green-100 text-green-700' :
                                    event.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {event.status}
                                </span>
                                <Link href={`/dashboard/events/${event.slug}`} className="p-2 text-slate-400 hover:text-slate-600">
                                    <MoreVertical className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
