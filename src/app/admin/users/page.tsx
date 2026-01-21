"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { TableSkeleton } from "../components/Skeletons";
import { Search, Filter, Eye, User, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import { adminApi } from "@/api/admin";

export default function AdminUsersPage() {
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchUsers = async (page = 1) => {
    setIsFetching(true);
    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const params: any = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await adminApi.getUsers(params);
      setUsers(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setInitialLoad(false);
      setIsFetching(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter, statusFilter]);

  if (initialLoad) return (
      <div className="p-8 max-w-[1600px] mx-auto w-full">
        <TableSkeleton />
      </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
           <p className="text-slate-500 text-sm mt-1">Manage users, hosts, and their account statuses</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isFetching ? 'text-violet-500 animate-pulse' : 'text-slate-400'}`} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white placeholder-slate-400 text-slate-900 shadow-sm transition-all hover:border-slate-300 w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            

            
            <select
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 font-medium shadow-sm transition-all hover:border-slate-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="">All Status</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
                <option value="Locked">Locked</option>
                <option value="Blocked">Blocked</option>
            </select>
        </div>
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
         <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Activity</th>
                    <th className="px-6 py-4 font-bold">Joined</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                   {(user.first_name || user.user_name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">
                                        {user.first_name ? `${user.first_name} ${user.last_name}` : user.user_name}
                                    </p>
                                    <p className="text-xs text-slate-500">@{user.user_name}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                     {user.events_count || 0} Hosted
                                </span>
                                <span className="text-xs text-slate-500 pl-3.5">
                                     {user.purchased_tickets_count || 0} Bought
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border ${
                                user.account_status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''
                            } ${
                                user.account_status === 'Unverified' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''
                            } ${
                                ['Locked', 'Blocked'].includes(user.account_status) ? 'bg-red-50 text-red-600 border-red-100' : ''
                            }`}>
                                {user.account_status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <Link 
                                href={`/admin/users/${user.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-all border border-violet-100 hover:border-violet-200 hover:-translate-y-0.5"
                             >
                                <Eye className="w-3.5 h-3.5" />
                                Profile
                             </Link>
                        </td>
                    </tr>
                ))}

                {!isFetching && users.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                           <div className="flex flex-col items-center gap-2">
                               <Search className="w-8 h-8 text-slate-300 mb-2" />
                               <p>No users found matching your criteria.</p>
                           </div>
                        </td>
                     </tr>
                )}
            </tbody>
         </table>
      </div>

      {/* Simplified Pagination */}
      {pagination && (pagination.prev_page_url || pagination.next_page_url) && (
          <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                disabled={!pagination.prev_page_url}
                onClick={() => fetchUsers(pagination.current_page - 1)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700"
              >
                  Previous
              </button>
              <span className="text-sm text-slate-600">Page {pagination.current_page}</span>
              <button 
                disabled={!pagination.next_page_url}
                onClick={() => fetchUsers(pagination.current_page + 1)}
                 className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700"
              >
                  Next
              </button>
          </div>
      )}
    </div>
  );
}
