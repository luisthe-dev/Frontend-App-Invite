"use client";

import {
  Plus,
  Calendar,
  DollarSign,
  Ticket,
  TrendingUp,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/api/auth";
import { hostApi } from "@/api/host";
import { userApi } from "@/api/user";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import RecentActivity from "./components/RecentActivity";
import UpcomingEvents from "./components/UpcomingEvents";
import StatCard from "./components/StatCard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import TrustScoreWidget from "./components/TrustScoreWidget"; 
import WithdrawalLimitModal from "./components/WithdrawalLimitModal";

export default function DashboardPage() {
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const router = useRouter();
  const [showKycModal, setShowKycModal] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawalEventId, setSelectedWithdrawalEventId] = useState<string>("");
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = () => setOpenDropdownId(null);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleCreateEvent = (e: React.MouseEvent) => {
      e.preventDefault();
      if (
      user?.kyc_status == null ||
      user?.kyc_status?.trim() == "" ||
      user?.kyc_status == "unverified"
    ) {
        setShowKycModal(true);
      } else {
        router.push("/dashboard/events/create");
      }
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch ALL data for everyone (Host Stats + User History)
            const [statsRes, activityRes, historyRes, eventsRes, chartRes] = await Promise.all([
                hostApi.getStats(),
                hostApi.getRecentActivity(),
                userApi.getHistory(),
                hostApi.getEvents({ limit: 5 }), // Fetch user's events for the table with limit
                hostApi.getChart({ period: chartPeriod })
            ]);
            setStats(statsRes);
            setRecentActivity(activityRes);
            setUserHistory(historyRes.data);
            setEvents(eventsRes.data || eventsRes || []); // Handle paginated response structure if applicable
            
            // Map chart data to ensure correct format for Recharts
            const mappedChartData = (chartRes || []).map((item: any) => ({
                name: item.date || item.name || '',  // Fallback to date if name is missing
                sales: item.total_sales || item.sales || item.amount || 0 // Fallback for various metric names
            }));
            setChartData(mappedChartData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    if (user) {
        fetchData();
    } else {
        setLoading(false); 
    }
  }, [chartPeriod]);

  if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-20 pt-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
  }

  // Helper component for Stat Card
  const StatCard = ({
    title,
    value,
    trend,
    trendValue,
    icon: Icon,
    colorClass,
    bgClass,
  }: any) => (
    <Card className="flex flex-col justify-between h-full hover:shadow-md transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-start mb-2">
        <div
          className={`w-10 h-10 ${bgClass.replace("bg-", "bg-opacity-10 dark:bg-opacity-20 ")} rounded-full flex items-center justify-center ${colorClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`text-xs font-bold ${trend === "up" ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-400"} flex items-center`}
          >
            {trend === "up" ? "+" : "-"}
            {trendValue}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            from last month
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 pt-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">
                {user?.first_name?.[0] || "U"}
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.first_name || "User"}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Here's what's happening with your events today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCreateEvent}
              className="shadow-lg shadow-violet-200 dark:shadow-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Link href="/dashboard/events">
              <Button
                variant="outline"
                className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View My Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="md:col-span-2 lg:col-span-2">
            <TrustScoreWidget />
          </div>
          <StatCard
            title="Total Earnings"
            value={formatCurrency(stats?.earnings?.value || 0)}
            trend={stats?.earnings?.trend}
            trendValue={stats?.earnings?.trend_value}
            icon={DollarSign}
            bgClass="bg-violet-50"
            colorClass="text-violet-600 dark:text-violet-400"
          />
          <StatCard
            title="Active Events"
            value={stats?.active_events?.value || 0}
            trend={stats?.active_events?.trend}
            trendValue={stats?.active_events?.trend_value}
            icon={Calendar}
            bgClass="bg-blue-50"
            colorClass="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Tickets Sold"
            value={stats?.tickets_sold?.value?.toLocaleString() || 0}
            trend={stats?.tickets_sold?.trend}
            trendValue={stats?.tickets_sold?.trend_value}
            icon={Ticket}
            bgClass="bg-green-50"
            colorClass="text-green-600 dark:text-green-400"
          />
          {/* <StatCard
            title="Avg. Ticket Price"
            value={formatCurrency(stats?.avg_ticket_price?.value || 0)}
            trend={stats?.avg_ticket_price?.trend}
            trendValue={stats?.avg_ticket_price?.trend_value}
            icon={TrendingUp}
            bgClass="bg-orange-50"
            colorClass="text-orange-600 dark:text-orange-400"
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section */}
          <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Ticket Sales Performance
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartPeriod("daily")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${chartPeriod === "daily" ? "bg-violet-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setChartPeriod("weekly")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${chartPeriod === "weekly" ? "bg-violet-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setChartPeriod("monthly")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${chartPeriod === "monthly" ? "bg-violet-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                      className="dark:opacity-10"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(value: any) => [
                        formatCurrency(value),
                        "Sales",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No sales data available for this period.
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Recent Activity
              </h2>
              <Link
                href="#"
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-6">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden relative border border-slate-100 dark:border-slate-700">
                    {/* Placeholder for event image if available, else icon */}
                    <div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs">
                      EV
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 uppercase">
                    New
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Upcoming Events Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Upcoming Events
            </h2>
            <Link
              href="/dashboard/events"
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700"
            >
              View Calendar
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-slate-400">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Tickets Sold</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {events.map((event) => {
                  if (!event) return null; // Skip undefined events

                  const sold = event?.tickets_sold || event?.tickets_count || 0;
                  // Calculate total capacity from tickets if available, otherwise 0
                  const total =
                    event?.capacity ||
                    event?.total_tickets ||
                    (event?.tickets
                      ? event.tickets.reduce(
                          (acc: number, t: any) =>
                            acc + (parseInt(t.quantity) || 0),
                          0,
                        )
                      : 0);
                  const percent =
                    total > 0 ? Math.min((sold / total) * 100, 100) : 0;

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group relative"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700 shrink-0 overflow-hidden relative">
                            {event.image_url ? (
                              <img
                                src={event.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                                <Calendar className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {event.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex flex-col">
                          <span>
                            {event.start_date
                              ? new Date(event.start_date).toLocaleDateString()
                              : "TBA"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {event.start_date
                              ? new Date(event.start_date).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : "TBA"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {event.location || "Online"}
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {event.city || "Location"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                            {sold} {total > 0 ? `/ ${total}` : "Sold"}
                          </span>
                        </div>
                        {total > 0 && (
                          <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-600 rounded-full"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${event.status === "published" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"}`}
                        >
                          {event.status === "published" ? "On Sale" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <Link
                            href={`/events/${event.slug}/edit`}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                            title="Edit Event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={(e) => toggleDropdown(e, event.id)}
                            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${openDropdownId === event.id ? "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-100"}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown */}
                        {openDropdownId === event.id && (
                          <div className="absolute top-10 right-0 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden origin-top-right text-left">
                            <div className="py-1">
                              <Link
                                href={`/events/${event.slug}`}
                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                View Event
                              </Link>
                              <Link
                                href={`/events/${event.slug}/edit`}
                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                Edit Details
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedWithdrawalEventId(event.id);
                                  setWithdrawalModalOpen(true);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-left"
                              >
                                <DollarSign className="w-3 h-3 text-violet-600" />
                                Early Withdrawal
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KYC Modal */}
      <ConfirmationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onConfirm={async () =>
          router.push("/dashboard/settings?tab=verification")
        }
        title="Identity Verification Required"
        message="You need to verify your identity before creating events. Please go to Settings to complete the verification process."
        variant="primary"
        confirmLabel="Go to Settings"
      />

      <WithdrawalLimitModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        eventId={selectedWithdrawalEventId}
      />
    </div>
  );
}
