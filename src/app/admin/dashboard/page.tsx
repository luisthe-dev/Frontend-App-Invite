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
        
        setAdmin(profileRes.data.user);
        setStats(statsRes.data);
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl text-slate-900 tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {admin?.name}
            </p>
            <p className="text-xs text-slate-500 font-medium">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-100"
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Top Selling
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.top_events?.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm truncate max-w-[180px] group-hover:text-violet-700 transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">{event.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">
                      {event.purchased_tickets_count}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">
                      tickets
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.top_events || stats.top_events.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">
                  No data available
                </p>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
              <Calendar className="w-4 h-4 text-violet-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Recent Events
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.recent_events?.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm truncate max-w-[180px] group-hover:text-violet-700 transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                      event.status === "published"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hosts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Top Hosts
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {stats?.top_hosts?.map((host: any) => (
                <div
                  key={host.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                      {(host.name || "U").charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {host.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">
                        {host.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">
                      {host.events_count}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">
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
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
      <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-medium text-sm group-hover:text-slate-700 transition-colors">
            {label}
          </span>
          <div
            className={`p-2.5 rounded-xl ${colors[color]} ring-1 ring-inset ring-black/5`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-slate-500 mb-1 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
              {" "}
              {subValue}{" "}
            </span>
          )}
        </div>
      </Card>
    );
}
