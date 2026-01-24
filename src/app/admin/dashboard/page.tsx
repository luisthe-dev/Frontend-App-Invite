"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { adminApi } from "@/api/admin";
import { Loader2, LogOut, ShieldCheck, Users, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DashboardSkeleton } from "../components/Skeletons";
import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      const token = Cookies.get("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const [profileRes, statsRes] = await Promise.all([
             adminApi.getProfile(),
             adminApi.getStats()
        ]);
        
        setAdmin(profileRes);
        setStats(statsRes);
      } catch (error) {
        console.error("Admin Load Failed", error);
        Cookies.remove("admin_token");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchStats();
  }, [router]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {
      console.error(e);
    }
    Cookies.remove("admin_token");
    router.push("/admin/login");
  };

// ... inside component ...

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col transition-colors">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border px-8 py-5 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl text-foreground tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">
              {admin?.name}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 hover:bg-destructive/10 rounded-xl text-muted-foreground hover:text-destructive transition-colors border border-border hover:border-destructive/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 sm:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Users"
            value={stats?.total_users || 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Total Events"
            value={stats?.total_events || 0}
            subValue={`${stats?.active_events || 0} active`}
            icon={Calendar}
            color="violet"
          />
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats?.total_volume || 0)}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            label="Pending Payouts"
            value={stats?.pending_payouts_count || 0}
            icon={AlertCircle}
            color="orange"
          />
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Selling Events */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/30">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Top Selling
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.top_events?.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors group"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm truncate max-w-[180px] group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-sm">
                      {event.purchased_tickets_count}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      tickets
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.top_events || stats.top_events.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No data available
                </p>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/30">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Recent Events
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.recent_events?.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors group"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm truncate max-w-[180px] group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                      event.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hosts */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/30">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Top Hosts
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.top_hosts?.map((host: any) => (
                <div
                  key={host.id}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {(host.name || "U").charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {host.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {host.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-sm">
                      {host.events_count}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      events
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, subValue, icon: Icon, color }: any) {
    const colors: any = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      violet:
        "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
      emerald:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      orange:
        "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    };

    return (
      <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-300 group bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground font-medium text-sm group-hover:text-foreground transition-colors">
            {label}
          </span>
          <div
            className={`p-2.5 rounded-xl ${colors[color]} ring-1 ring-inset ring-black/5 dark:ring-white/10`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-muted-foreground mb-1 font-medium bg-muted px-2 py-0.5 rounded-full">
              {" "}
              {subValue}{" "}
            </span>
          )}
        </div>
      </Card>
    );
}
