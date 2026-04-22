"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Globe
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { TableSkeleton } from "../components/Skeletons";

export default function AuditLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [actionFilter, setActionFilter] = useState(searchParams.get("action") || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const filters: any = {};
      if (actionFilter) filters.action = actionFilter;
      if (dateFilter) filters.date = dateFilter;

      const response = await adminApi.getAuditLogs(page, filters);
      setLogs(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, dateFilter]);

  const openDetails = (log: any) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor all administrative actions across the platform.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full h-11 bg-muted/50 border-border rounded-lg px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="">All Actions</option>
              <option value="user_status_update">User Status Update</option>
              <option value="event_approved">Event Approved</option>
              <option value="event_rejected">Event Rejected</option>
              <option value="event_deleted">Event Deleted</option>
              <option value="system_settings_updated">System Settings Updated</option>
              <option value="trust_score_settings_updated">Trust Score Rules Updated</option>
              <option value="trust_tier_updated">Trust Tier Updated</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-11 bg-muted/50 border-border rounded-lg px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold">Admin</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                  <th className="px-6 py-4 font-bold">Target</th>
                  <th className="px-6 py-4 font-bold">IP Address</th>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-accent/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {log.admin.first_name[0]}{log.admin.last_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {log.admin.first_name} {log.admin.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">Admin</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[11px] font-mono bg-muted px-2 py-1 rounded-md text-primary">
                          {log.action}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {log.target_type ? (
                            <span className="flex items-center gap-1.5 capitalize">
                              <span className="text-xs text-muted-foreground">{log.target_type}:</span>
                              {log.target_id}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">System</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                        {log.ip_address || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(log.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDetails(log)}
                          className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No audit logs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.meta.last_page > 1 && (
          <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{pagination.meta.from}</span> to <span className="font-semibold text-foreground">{pagination.meta.to}</span> of <span className="font-semibold text-foreground">{pagination.meta.total}</span> logs
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.meta.current_page === 1}
                onClick={() => fetchLogs(pagination.meta.current_page - 1)}
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.meta.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchLogs(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      pagination.meta.current_page === p
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={pagination.meta.current_page === pagination.meta.last_page}
                onClick={() => fetchLogs(pagination.meta.current_page + 1)}
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Action Details</h2>
                  <p className="text-sm text-muted-foreground">{selectedLog.action}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-8">
              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Admin</p>
                  <p className="text-sm font-semibold">{selectedLog.admin.first_name} {selectedLog.admin.last_name}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">IP Address</p>
                  <p className="text-sm font-semibold font-mono">{selectedLog.ip_address || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Target</p>
                  <p className="text-sm font-semibold">
                    {selectedLog.target_type ? `${selectedLog.target_type} (${selectedLog.target_id})` : "System"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Time</p>
                  <p className="text-sm font-semibold">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Data Diff */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Data Comparison
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Old Values */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Before Change</p>
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 font-mono text-xs overflow-x-auto min-h-[150px]">
                      {selectedLog.old_values ? (
                        <pre className="text-destructive whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.old_values, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-muted-foreground italic">No previous values recorded</p>
                      )}
                    </div>
                  </div>

                  {/* New Values */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">After Change</p>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 font-mono text-xs overflow-x-auto min-h-[150px]">
                      {selectedLog.new_values ? (
                        <pre className="text-emerald-600 dark:text-emerald-500 whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.new_values, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-muted-foreground italic">No new values recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Agent */}
              {selectedLog.user_agent && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">User Agent (Metadata)</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{selectedLog.user_agent}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-muted/20 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
