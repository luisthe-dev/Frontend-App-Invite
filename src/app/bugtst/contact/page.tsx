"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { adminApi } from "@/api/admin";
import { ContactMessage } from "@/types/models";
import {
  Mail,
  Filter,
  Search,
  Clock,
  CheckCircle,
  ChevronRight,
  MoreHorizontal,
  Inbox,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminContactMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (searchTerm) params.search = searchTerm;
            
            const res = await adminApi.getContactMessages(params);
            setMessages(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      fetchMessages();
    }, [filterStatus]); 

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMessages();
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this message?")) return;
        
        try {
            await adminApi.deleteContactMessage(id);
            toast.success("Message deleted");
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const getStatusBadge = (status: string) => {
      const styles: Record<string, string> = {
        unread: "bg-blue-50 text-blue-700 ring-blue-700/10",
        read: "bg-slate-50 text-slate-600 ring-slate-600/10",
        replied: "bg-emerald-50 text-emerald-700 ring-emerald-700/10",
      };
      const style =
        styles[status] || "bg-gray-50 text-gray-600 ring-gray-500/10";

      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
        >
          {status}
        </span>
      );
    };

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Contact Inquiries
              </h1>
              <p className="text-muted-foreground mt-1">
                All messages sent from the public contact page.
              </p>
            </div>

            <div className="flex gap-3">
              <select
                className="bg-card border border-input text-foreground text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
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
                  placeholder="Search by name, email, or subject..."
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
                    <th className="px-6 py-4">Sender</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Received</th>
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
                            <div className="h-4 w-48 bg-muted rounded"></div>
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
                  ) : messages.length > 0 ? (
                    messages.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-accent/50 transition-colors group cursor-pointer ${item.status === 'unread' ? 'bg-blue-50/30' : ''}`}
                        onClick={() =>
                          (window.location.href = `/bugtst/contact/${item.id}`)
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-foreground font-medium truncate max-w-[300px] block">
                            {item.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button
                                onClick={(e) => handleDelete(item.id, e)}
                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                                href={`/bugtst/contact/${item.id}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-background hover:shadow-sm hover:ring-1 hover:ring-border transition-all text-muted-foreground hover:text-primary"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No messages found</p>
                        <p className="text-sm opacity-70">
                          Messages from the contact form will appear here.
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
