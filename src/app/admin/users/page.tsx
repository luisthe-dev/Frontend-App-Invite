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
      setUsers(response.data);
      setPagination(response);
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage users, hosts, and their account statuses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isFetching ? "text-primary animate-pulse" : "text-muted-foreground"}`}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background placeholder:text-muted-foreground text-foreground shadow-sm transition-all hover:border-accent-foreground/20 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-medium shadow-sm transition-all hover:border-accent-foreground/20"
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

      <div
        className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Activity</th>
              <th className="px-6 py-4 font-bold">Joined</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-accent/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-bold">
                      {(user.first_name || user.user_name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {user.first_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.user_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user.user_name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {user.events_count || 0} Hosted
                    </span>
                    <span className="text-xs text-muted-foreground pl-3.5">
                      {user.purchased_tickets_count || 0} Bought
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border ${
                      user.account_status === "Verified"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : ""
                    } ${
                      user.account_status === "Unverified"
                        ? "bg-muted text-muted-foreground border-border"
                        : ""
                    } ${
                      ["Locked", "Blocked"].includes(user.account_status)
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : ""
                    }`}
                  >
                    {user.account_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Profile
                  </Link>
                </td>
              </tr>
            ))}

            {!isFetching && users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-muted-foreground text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
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
            className="px-4 py-2 border border-input rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent text-foreground"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.current_page}
          </span>
          <button
            disabled={!pagination.next_page_url}
            onClick={() => fetchUsers(pagination.current_page + 1)}
            className="px-4 py-2 border border-input rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent text-foreground"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
