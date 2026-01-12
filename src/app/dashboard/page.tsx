"use client";

import { Plus, Calendar, DollarSign, Ticket, TrendingUp, MoreHorizontal, Clock, ArrowRight, User, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/api/auth";
import { hostApi } from "@/api/host";
import { userApi } from "@/api/user";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from "@/lib/utils";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useRouter } from "next/navigation";



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
      if (user?.kyc_status !== 'verified') {
          setShowKycModal(true);
      } else {
          router.push('/events/create');
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
                hostApi.getChart()
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
  }, []);

  if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse"></div>
                     ))}
                 </div>
            </div>
        </div>
      )
  }

  // Helper component for Stat Card
  const StatCard = ({ title, value, trend, trendValue, icon: Icon, colorClass, bgClass }: any) => (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
              <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-5 h-5" />
              </div>
          </div>
          <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              <div className="flex items-center gap-1.5 mt-2">
                   <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-500'} flex items-center`}>
                       {trend === 'up' ? '+' : '-'}{trendValue}
                   </span>
                   <span className="text-xs text-gray-400">from last month</span>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{user?.first_name} {user?.last_name}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || 'User'}!</h1>
                <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={handleCreateEvent} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm text-sm">
                    <Plus className="w-4 h-4" />
                    Create Event
                </button>
                <Link href="/dashboard/events" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm">
                    <Calendar className="w-4 h-4" />
                    View My Events
                </Link>
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Total Earnings" 
                value={formatCurrency(stats?.earnings?.value || 0)} 
                trend={stats?.earnings?.trend} 
                trendValue={stats?.earnings?.trend_value} 
                icon={DollarSign} 
                bgClass="bg-violet-50" 
                colorClass="text-violet-600" 
            />
            <StatCard 
                title="Active Events" 
                value={stats?.active_events?.value || 0} 
                trend={stats?.active_events?.trend} 
                trendValue={stats?.active_events?.trend_value} 
                icon={Calendar} 
                bgClass="bg-blue-50" 
                colorClass="text-blue-600" 
            />
            <StatCard 
                title="Tickets Sold" 
                value={stats?.tickets_sold?.value?.toLocaleString() || 0} 
                trend={stats?.tickets_sold?.trend} 
                trendValue={stats?.tickets_sold?.trend_value} 
                icon={Ticket} 
                bgClass="bg-green-50" 
                colorClass="text-green-600" 
            />
             <StatCard 
                title="Avg. Ticket Price" 
                value={formatCurrency(stats?.avg_ticket_price?.value || 0)} 
                trend={stats?.avg_ticket_price?.trend} 
                trendValue={stats?.avg_ticket_price?.trend_value} 
                icon={TrendingUp} 
                bgClass="bg-orange-50" 
                colorClass="text-orange-600" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Ticket Sales Performance</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-lg">Daily</button>
                        <button className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100">Weekly</button>
                        <button className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100">Monthly</button>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                                    itemStyle={{color: '#fff'}}
                                    formatter={(value: any) => [formatCurrency(value), 'Sales']}
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
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No sales data available for this period.
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                    <Link href="#" className="text-xs font-bold text-violet-600 hover:text-violet-700">View All</Link>
                </div>
                <div className="space-y-6">
                    {recentActivity.slice(0, 5).map((activity, i) => (
                        <div key={i} className="flex items-start gap-3">
                             <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                 {/* Placeholder for event image if available, else icon */}
                                 <div className="absolute inset-0 bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                                     EV
                                 </div>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className="text-sm font-bold text-gray-900 truncate">{activity.title}</p>
                                 <p className="text-xs text-gray-500 truncate">{activity.desc}</p>
                             </div>
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 uppercase">
                                New
                             </span>
                        </div>
                    ))}
                    {recentActivity.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">No recent activity</div>
                    )}
                </div>
            </div>
        </div>

        {/* Upcoming Events Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                <Link href="/dashboard/events" className="text-xs font-bold text-violet-600 hover:text-violet-700">View Calendar</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Tickets Sold</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map((event) => {
                            if (!event) return null; // Skip undefined events
                            
                            const sold = event?.tickets_sold || event?.tickets_count || 0; 
                            // Calculate total capacity from tickets if available, otherwise 0
                            const total = event?.capacity || event?.total_tickets || (event?.tickets ? event.tickets.reduce((acc: number, t: any) => acc + (parseInt(t.quantity) || 0), 0) : 0);
                            const percent = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
                            
                            return (
                                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group relative">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                                                {event.image_url ? (
                                                    <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{event.title}</p>
                                                <p className="text-xs text-gray-500">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'TBA'}</span>
                                            <span className="text-xs text-gray-500">{event.start_date ? new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {event.location || 'Online'}
                                        <div className="text-xs text-gray-500">{event.city || 'Location'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-xs">
                                                {sold} {total > 0 ? `/ ${total}` : 'Sold'}
                                            </span>
                                        </div>
                                        {total > 0 && (
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-600 rounded-full" style={{width: `${percent}%`}}></div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${event.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {event.status === 'published' ? 'On Sale' : 'Draft'}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 text-center relative">
                                         <div className="flex items-center justify-center gap-2 transition-opacity">
                                             <Link href={`/events/${event.slug}/edit`} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-violet-600" title="Edit Event">
                                                 <Pencil className="w-4 h-4" />
                                             </Link>
                                             <button 
                                                onClick={(e) => toggleDropdown(e, event.id)}
                                                className={`p-1.5 rounded hover:bg-gray-100 ${openDropdownId === event.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                             >
                                                 <MoreHorizontal className="w-4 h-4" />
                                             </button>
                                         </div>
                                         
                                         {/* Dropdown */}
                                         {openDropdownId === event.id && (
                                            <div className="absolute top-10 right-0 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right text-left">
                                                <div className="py-1">
                                                    <Link href={`/events/${event.slug}`} className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                                        View Event
                                                    </Link>
                                                    <Link href={`/events/${event.slug}/edit`} className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                                        Edit Details
                                                    </Link>
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
            onConfirm={() => router.push('/dashboard/settings')}
            title="Identity Verification Required"
            message="You need to verify your identity before creating events. Please go to Settings to complete the verification process."
            isDestructive={false}
            confirmText="Go to Settings"
        />
    </div>
  );
}
