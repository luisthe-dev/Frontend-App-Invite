"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { TableSkeleton } from "../components/Skeletons";
import { Loader2, Search, Filter, Eye, DollarSign, Calendar } from "lucide-react";
import { adminApi } from "@/api/admin";

export default function AdminEventsPage() {
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEvents = async (page = 1) => {
    setIsFetching(true);
    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const params: any = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;

      const response = await adminApi.getEvents(params);
      setEvents(response.data);
      setPagination(response);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setInitialLoad(false);
      setIsFetching(false);
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchEvents();
  }, [debouncedSearch, statusFilter]);

  if (initialLoad) return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <TableSkeleton />
      </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Events Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and moderate event listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isFetching ? "text-primary animate-pulse" : "text-muted-foreground"}`}
            />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-9 pr-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background placeholder:text-muted-foreground text-foreground shadow-sm transition-all hover:border-accent-foreground/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-medium shadow-sm transition-all hover:border-accent-foreground/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div
        className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Event</th>
              <th className="px-6 py-4 font-bold">Host</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr
                key={event.id}
                onClick={() => router.push(`/admin/events/${event.id}`)}
                className="hover:bg-accent/50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border shadow-sm relative group-hover:shadow-md transition-shadow">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Calendar className="w-5 h-5 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate max-w-[200px] group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {event.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {event.user ? (
                    <Link
                      href={`/admin/users/${event.user.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="group/host"
                    >
                      <p className="text-sm font-medium text-foreground group-hover/host:text-primary transition-colors">
                        {event.user.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground group-hover/host:text-primary/80 transition-colors">
                        {event.user.email}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        Unknown
                      </p>
                      <p className="text-xs text-muted-foreground">-</p>
                    </>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(event.start_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border ${
                      event.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : ""
                    } ${
                      event.status === "draft"
                        ? "bg-muted text-muted-foreground border-border"
                        : ""
                    } ${
                      event.status === "suspended"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : ""
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/events/${event.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Review
                  </Link>
                </td>
              </tr>
            ))}

            {!isFetching && events.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-muted-foreground text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
                    <p>No events found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simplified Pagination */}
      {pagination && (pagination.prev_page_url || pagination.next_page_url) && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => fetchEvents(pagination.current_page - 1)}
            className="px-4 py-2 border border-input rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent text-foreground"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.current_page}
          </span>
          <button
            disabled={!pagination.next_page_url}
            onClick={() => fetchEvents(pagination.current_page + 1)}
            className="px-4 py-2 border border-input rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent text-foreground"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
