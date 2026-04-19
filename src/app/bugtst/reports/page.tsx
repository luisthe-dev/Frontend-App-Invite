"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    fetchData();
  }, [chartPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getChart({ period: chartPeriod })
      ]);
      setStats(statsRes);
      setChartData(chartRes);
    } catch (error) {
      console.error("Failed to load report data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
          <div className="h-96 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 pb-20 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Reports</h1>
        <p className="text-muted-foreground mt-1">Analytics and insights across all events and users.</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.total_volume || 0)}</h3>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total_users || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total_events || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pending_payouts_count || 0}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="bg-card p-6 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold">Revenue Overview</h2>
          <div className="flex bg-muted p-1 rounded-lg">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period as any)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                  chartPeriod === period
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [formatCurrency(value || 0), 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Grid */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Events */}
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Top Events</h2>
              <Link href="/bugtst/events" className="text-sm text-primary hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {stats.top_events?.length > 0 ? stats.top_events.map((event: any, index: number) => (
                <div key={event.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{event.user?.first_name} {event.user?.last_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{event.purchased_tickets_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Tickets</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-muted-foreground text-sm py-4">No events found.</p>
              )}
            </div>
          </div>

          {/* Top Hosts */}
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Top Hosts</h2>
              <Link href="/bugtst/users" className="text-sm text-primary hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {stats.top_hosts?.length > 0 ? stats.top_hosts.map((host: any, index: number) => (
                <div key={host.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{host.first_name} {host.last_name}</p>
                      <p className="text-xs text-muted-foreground">{host.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{host.events_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-muted-foreground text-sm py-4">No hosts found.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
