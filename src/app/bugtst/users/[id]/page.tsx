"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Check,
  X,
  Lock,
  Unlock,
  Ban,
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { formatCurrency } from "@/lib/utils";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "sonner";

export default function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    newStatus: string;
  }>({
    isOpen: false,
    newStatus: "",
  });

  const handleStatusUpdate = (newStatus: string) => {
    setConfirmModal({
      isOpen: true,
      newStatus,
    });
  };

  const executeStatusUpdate = async () => {
    const { newStatus } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    
    setUpdating(true);
    try {
      const response = await adminApi.updateUserStatus(id, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      setUser(response); 
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdating(false);
    }
  };

  // Events Tables State
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const token = Cookies.get("admin_token");
        if (!token) {
          router.push("/bugtst/login");
          return;
        }

        // 1. Get User Profile & Stats
        const userRes = await adminApi.getUser(id);
        setUser(userRes.user);
        setStats(userRes.stats);

        // 2. Get Events (Active)
        // We'll filter client side or make separate calls if volume is huge, for now client side filtering of a small fetch is okay,
        // OR we just fetch all and separate.
        // Actually, backend supports status filter.
        // Let's fetch "all" and just sort them here for the UI demo or assume the backend gives us a unified list.
        // The backend `events` endpoint gives us pagination.
        // Let's fetch generic events list for this user.
        const eventsRes = await adminApi.getUserEvents(id);
        // Simplification: Just showing recent events in two buckets based on date
        const allEvents = eventsRes.data;
        const now = new Date();

        setActiveEvents(
          allEvents.filter(
            (e: any) => new Date(e.end_date || e.start_date) >= now,
          ),
        );
        setPastEvents(
          allEvents.filter(
            (e: any) => new Date(e.end_date || e.start_date) < now,
          ),
        );
      } catch (error) {
        console.error("Failed to load user", error);
        router.push("/bugtst/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEvents();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      {/* Back Button */}
      <Link
        href="/bugtst/users"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* Header Profile Card */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-md ring-1 ring-border">
            {(user.first_name || user.user_name || "U").charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  {user.first_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.user_name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {user.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${
                    user.account_status === "Verified"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : user.account_status === "Unverified"
                        ? "bg-muted text-muted-foreground border-border"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {user.account_status}
                </div>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {user.events_count || 0}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Tickets Sold
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.tickets_sold || 0}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Tickets Bought
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.tickets_bought || 0}
                </p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-500">
                  {formatCurrency(stats?.total_revenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs/Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Events */}
        <div className="xl:col-span-2 space-y-8 order-first xl:order-none">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Active Events
            </h2>

            {activeEvents.length > 0 ? (
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <EventsTable events={activeEvents} />
              </div>
            ) : (
              <div className="p-8 bg-muted/30 rounded-xl border border-border border-dashed text-center text-muted-foreground">
                No active events currently.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 opacity-70">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Past Events
            </h2>

            {pastEvents.length > 0 ? (
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden opacity-90">
                <EventsTable events={pastEvents} />
              </div>
            ) : (
              <div className="p-8 bg-muted/30 rounded-xl border border-border border-dashed text-center text-muted-foreground">
                No past events found.
              </div>
            )}
          </section>
        </div>

        {/* Side Column: Other Info (KYC, etc) */}
        <div className="space-y-6">
          {/* Account Status Management - QUICK ACTIONS */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Manage Account
            </h3>
            
            <div className="space-y-3">
              <button
                disabled={updating || user.account_status === "Verified"}
                onClick={() => handleStatusUpdate("Verified")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50 disabled:grayscale transition-all text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verify / Unlock
                </div>
                {user.account_status === "Verified" && <Check className="w-4 h-4" />}
              </button>

              <button
                disabled={updating || user.account_status === "Locked"}
                onClick={() => handleStatusUpdate("Locked")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 disabled:opacity-50 disabled:grayscale transition-all text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Lock Account
                </div>
                {user.account_status === "Locked" && <Check className="w-4 h-4" />}
              </button>

              <button
                disabled={updating || user.account_status === "Blocked"}
                onClick={() => handleStatusUpdate("Blocked")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:grayscale transition-all text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Block User
                </div>
                {user.account_status === "Blocked" && <Check className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
              * Verified users have full access. Locked users are temporarily restricted (e.g. during password resets). Blocked users are banned from the platform.
            </p>
          </div>

          {/* KYC Info */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">KYC Verification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">BVN</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {user.is_bvn_verified ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Bank Account
                </span>
                <span className="text-sm font-medium text-foreground text-right">
                  {user.bank_name
                    ? `${user.bank_name} - ${user.account_number}`
                    : "Not Linked"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeStatusUpdate}
        title="Update User Status"
        message={`Are you sure you want to change this user's status to ${confirmModal.newStatus}?`}
        confirmText="Update Status"
        type={confirmModal.newStatus === "Blocked" ? "danger" : "warning"}
        isLoading={updating}
      />
    </div>
  );
}

function EventsTable({ events }: { events: any[] }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
        <tr>
          <th className="px-6 py-4 font-bold">Event</th>
          <th className="px-6 py-4 font-bold">Date</th>
          <th className="px-6 py-4 font-bold">Status</th>
          <th className="px-6 py-4 font-bold text-right">Link</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {events.map((event) => (
          <tr key={event.id} className="hover:bg-accent/50 transition-colors">
            <td className="px-6 py-4">
              <p className="font-semibold text-foreground text-sm truncate max-w-[200px]">
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Starts at {formatCurrency(event.tickets?.[0]?.price || 0)}
              </p>
            </td>
            <td className="px-6 py-4 text-sm text-muted-foreground">
              {new Date(event.start_date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                  event.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {event.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <Link
                href={`/bugtst/events/${event.id}`}
                className="text-primary hover:text-primary/90 text-sm font-medium hover:underline"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
