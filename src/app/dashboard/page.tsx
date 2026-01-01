"use client";

import { Plus, Calendar, DollarSign, Ticket, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/api/auth";
import { hostApi } from "@/api/host";
import { userApi } from "@/api/user";

export default function DashboardPage() {
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userHistory, setUserHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch ALL data for everyone (Host Stats + User History)
            const [statsRes, activityRes, historyRes] = await Promise.all([
                hostApi.getStats(),
                hostApi.getRecentActivity(),
                userApi.getHistory()
            ]);
            setStats(statsRes);
            setRecentActivity(activityRes);
            setUserHistory(historyRes.data);
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
  }, [user]);

  if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="h-40 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                             <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4"></div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.user_name || user?.first_name || 'User'}!</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your events and tickets.</p>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/dashboard/events" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <Calendar className="w-4 h-4" />
                    My Hosted Events
                </Link>
                <Link href="/events/create" className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                    <Plus className="w-4 h-4" />
                    Create Event
                </Link>
            </div>
        </div>

        {/* --- HOSTING STATS SECTION --- */}
        <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hosting Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Earnings */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{stats?.earnings?.toLocaleString() || '0.00'}</h3>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        <span>Lifetime</span>
                    </div>
                </div>

                {/* Active Events */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Active Events</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.active_events || 0}</h3>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        <span>Now Valid</span>
                    </div>
                </div>

                {/* Tickets Sold */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <Ticket className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Tickets Sold</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.tickets_sold?.toLocaleString() || 0}</h3>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                         <span>Total Sold</span>
                    </div>
                </div>

                {/* Avg Price */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                            <Ticket className="w-6 h-6 rotate-45" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Avg. Ticket Price</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{stats?.avg_ticket_price || '0.00'}</h3>
                    <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs font-medium">
                        <span>Per Ticket</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* --- MY TICKETS SECTION (Replacing Chart) --- */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">My Ticket History</h2>
                     <Link href="/" className="text-sm font-medium text-violet-600 hover:text-violet-700">Find More Events</Link>
                </div>
                
                 <div className="overflow-x-auto flex-1">
                    {userHistory.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Ticket</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {userHistory.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {tx.primary_event_title}
                                            <div className="text-xs text-gray-400 font-normal mt-0.5">{tx.reference}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tx.summary[0]?.event_date ? new Date(tx.summary[0].event_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                             {tx.item_count} x {tx.summary[0]?.ticket_type || 'Ticket'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.status === 'payment_successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {tx.status === 'payment_successful' ? 'Paid' : tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link 
                                                href={`/payment/verify?status=success&reference=${tx.reference}`}
                                                className="text-violet-600 hover:text-violet-700 font-medium text-xs border border-violet-100 bg-violet-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="flex flex-col items-center justify-center py-12 px-4 h-full">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Ticket className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No tickets purchased yet</p>
                        </div>
                    )}
                 </div>
            </div>

            {/* Recent HOST Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-fit">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">My Sales Activity</h2>
                </div>
                
                {recentActivity.length > 0 ? (
                    <div className="space-y-6">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase bg-green-50 text-green-700`}>
                                    Sold
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No sales yet</p>
                        <p className="text-xs text-gray-500 mt-1">Sales from your events will appear here</p>
                    </div>
                )}
            </div>

        </div>

      </div>
    </div>
  );
}
