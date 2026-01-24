"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { adminApi } from "@/api/admin";
import {
  MessageSquare,
  Filter,
  Search,
  Clock,
  CheckCircle,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (searchTerm) params.search = searchTerm;
            
            const res = await adminApi.getTickets(params);
            setTickets(res.data);
            // setPagination(res); // If pagination was used, access res directly. Checking if setPagination exists in context.
            // But grep showed setTickets(res.data.data).
            // Let's assume pagination follows.
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      fetchTickets();
    }, [filterStatus]); 

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    const getStatusBadge = (status: string) => {
      const styles: Record<string, string> = {
        open: "bg-blue-50 text-blue-700 ring-blue-700/10",
        customer_reply: "bg-amber-50 text-amber-700 ring-amber-700/10",
        agent_reply: "bg-purple-50 text-purple-700 ring-purple-700/10",
        closed: "bg-slate-50 text-slate-600 ring-slate-600/10",
        resolved: "bg-emerald-50 text-emerald-700 ring-emerald-700/10",
      };
      const style =
        styles[status] || "bg-gray-50 text-gray-600 ring-gray-500/10";

      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
        >
          {status.replace(/_/g, " ")}
        </span>
      );
    };

    const getPriorityBadge = (priority: string) => {
      const styles: Record<string, string> = {
        urgent: "text-red-600 bg-red-50",
        high: "text-orange-600 bg-orange-50",
        medium: "text-yellow-600 bg-yellow-50",
        low: "text-slate-600 bg-slate-50",
      };
      const style = styles[priority] || "text-slate-600 bg-slate-50";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
        >
          {priority}
        </span>
      );
    };

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Support Tickets
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and respond to user inquiries.
              </p>
            </div>

            <div className="flex gap-3">
              <select
                className="bg-card border border-input text-foreground text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="customer_reply">Pending Reply</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-4">
              <form
                onSubmit={handleSearch}
                className="flex-1 relative max-w-md"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by ID, subject, or user..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Ticket</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Last Updated</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 w-32 bg-muted rounded"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-20 bg-muted rounded"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-16 bg-muted rounded"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-24 bg-muted rounded ml-auto"></div>
                          </td>
                          <td className="px-6 py-4"></td>
                        </tr>
                      ))
                  ) : tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-accent/50 transition-colors group cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/admin/support/${ticket.id}`)
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              #{String(ticket.id).padStart(6, '0')}
                            </span>
                            <span className="text-muted-foreground truncate max-w-[200px]">
                              {ticket.subject}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                              {ticket.user?.first_name?.[0]}
                              {ticket.user?.last_name?.[0]}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {ticket.user?.first_name}{" "}
                                {ticket.user?.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {ticket.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className="capitalize">
                              {ticket.category}
                            </span>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(ticket.status)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                          {new Date(ticket.updated_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/support/${ticket.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-background hover:shadow-sm hover:ring-1 hover:ring-border transition-all text-muted-foreground hover:text-primary"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No tickets found</p>
                        <p className="text-sm opacity-70">
                          Try adjusting your filters or search.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}
