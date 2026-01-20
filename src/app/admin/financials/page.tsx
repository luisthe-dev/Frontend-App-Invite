"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { TableSkeleton } from "../components/Skeletons";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { formatCurrency } from "@/lib/utils";

export default function AdminFinancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [payouts, setPayouts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]); // For Overview

  // Filters
  const [txSearch, setTxSearch] = useState("");
  const [txType, setTxType] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [txSort, setTxSort] = useState("created_at:desc");

  // Load Stats & Recent only once or on demand
  const fetchOverview = async () => {
      try {
          const [statsRes, recentRes] = await Promise.all([
              adminApi.getFinanceStats(),
              adminApi.getTransactions({ page: 1, limit: 5 }) // Get top 5 recent
          ]);
          setStats(statsRes.data);
          setRecentTransactions(recentRes.data.data);
      } catch (e) {
          console.error("Overview fetch failed", e);
      }
  };

  const fetchPayouts = async () => {
      try {
          const res = await adminApi.getPayouts();
          setPayouts(res.data.data);
      } catch (e) { console.error("Payouts fetch failed", e); }
  };

  const fetchTransactions = async () => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Prepare filter params for transactions
      const [sortBy, sortOrder] = txSort.split(':');
      const txParams: any = {};
      if (txSearch) txParams.search = txSearch;
      if (txType) txParams.type = txType;
      if (txStatus) txParams.status = txStatus;
      if (txSort) {
          txParams.sort_by = sortBy;
          txParams.sort_order = sortOrder;
      }

      const txRes = await adminApi.getTransactions(txParams);
      setTransactions(txRes.data.data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    }
  };

  // Initial Load
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOverview(), fetchPayouts(), fetchTransactions()]).finally(() => setLoading(false));
  }, []);

  // Effect for Transaction Filters
  useEffect(() => {
     if (activeTab === 'transactions') {
         fetchTransactions();
     }
  }, [txType, txStatus, txSort]); // Removed txSearch to keep it manual

  // Effect for Payouts (refresh when tab active if needed, or just initial is fine)
  useEffect(() => {
      if (activeTab === 'payouts') {
          fetchPayouts();
      }
  }, [activeTab]);

  const handleQuickSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          setTxSearch(e.currentTarget.value);
          setActiveTab('transactions');
          // small delay to allow tab switch to render then fetch will trigger? 
          // Actually fetchTransactions depends on state, so calling it directly works best AFTER state update
          // But strict mode might batch. Let's trust the effect hook if we added txSearch dependency, but we didn't.
          // So we should manually call fetch.
          setTimeout(() => fetchTransactions(), 100); 
      }
  };

  /* 
    ... existing code ...
  */

  const handleProcessPayout = async (id: string) => {
    if (!confirm("Are you sure you want to mark this payout as PROCESSED manually?")) return;
    try {
        await adminApi.processPayout(id);
        alert("Payout processed successfully");
        fetchPayouts(); // Refresh Only Payouts
        fetchOverview(); // Refresh Stats
    } catch (error) {
        alert("Failed to process payout");
    }
  };

  const handleRejectPayout = async (id: string) => {
    if (!confirm("Are you sure you want to REJECT and REFUND this payout?")) return;
    try {
        await adminApi.rejectPayout(id);
        alert("Payout rejected and refunded");
        fetchPayouts(); // Refresh Payouts
        fetchOverview(); // Refresh Stats
    } catch (error) {
         alert("Failed to reject payout");
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto w-full">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financials</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor revenue, process payouts, and audit transactions.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Volume</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.total_volume || 0)}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <DollarSign className="w-5 h-5" />
             </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pending Payouts</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.pending_payouts_volume || 0)}</p>
                 <p className="text-xs text-orange-600 mt-1 font-medium">{stats?.pending_payouts_count || 0} Requests</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                 <Clock className="w-5 h-5" />
             </div>
        </div>
         <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Processed Payouts</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.processed_payouts_volume || 0)}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <CheckCircle className="w-5 h-5" />
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'text-violet-600 border-violet-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
        >
            Overview & Stats
        </button>
        <button 
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'payouts' ? 'text-violet-600 border-violet-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
        >
            Payout Requests
            {stats?.pending_payouts_count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                    {stats.pending_payouts_count}
                </span>
            )}
        </button>
        <button 
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'transactions' ? 'text-violet-600 border-violet-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
        >
            All Transactions
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* PAYOUTS TAB */}
        {activeTab === 'payouts' && (
            <div className="min-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h3 className="font-bold text-slate-900">Pending Withdrawals</h3>
                     <button onClick={fetchPayouts} className="text-slate-500 hover:text-violet-600 transition-colors">
                        <RefreshCcw className="w-4 h-4" />
                     </button>
                </div>
                {payouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <CheckCircle className="w-12 h-12 mb-4 text-emerald-100" />
                        <p>No pending payouts. All caught up!</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Host</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Bank Details</th>
                                <th className="px-6 py-4 font-bold">Requested</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payouts.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {(tx.wallet?.user?.first_name || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {tx.wallet?.user?.first_name} {tx.wallet?.user?.last_name}
                                                </p>
                                                <p className="text-xs text-slate-500">{tx.wallet?.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                        {formatCurrency(tx.total_amount)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {/* Assuming bank details are in description or accessible via User */}
                                        <p className="text-xs">{tx.description || 'Bank Transfer'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                            onClick={() => handleRejectPayout(tx.id)}
                                            className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleProcessPayout(tx.id)}
                                            className="text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded transition-colors shadow-sm"
                                        >
                                            Mark Paid
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
             <div className="min-h-[400px]">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
                      {/* Search */}
                      <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                              type="text" 
                              placeholder="Search ref, user, email..." 
                              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white placeholder-slate-400 text-slate-900 shadow-sm w-64"
                              value={txSearch}
                              onChange={(e) => setTxSearch(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                          />
                      </div>
                      
                      <div className="flex items-center gap-3">
                            <button 
                                onClick={fetchTransactions} 
                                className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                title="Apply Filters"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>

                            {/* Type Filter */}
                            <select 
                                className="text-sm border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                                value={txType}
                                onChange={(e) => setTxType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Purchase">Purchase</option>
                                <option value="Withdrawal">Withdrawal</option>
                                <option value="Refund">Refund</option>
                                <option value="Deposit">Deposit</option>
                            </select>

                            {/* Status Filter (New) */}
                            <select 
                                className="text-sm border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                                value={txStatus}
                                onChange={(e) => setTxStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="payment_successful">Successful</option>
                                <option value="pending_confirmation">Pending</option>
                                <option value="payment_failed">Failed</option>
                            </select>

                             {/* Sort (New) */}
                            <select 
                                className="text-sm border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                                value={txSort}
                                onChange={(e) => setTxSort(e.target.value)}
                            >
                                <option value="created_at:desc">Newest First</option>
                                <option value="created_at:asc">Oldest First</option>
                                <option value="total_amount:desc">Highest Amount</option>
                                <option value="total_amount:asc">Lowest Amount</option>
                            </select>
                      </div>
                 </div>
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-bold">Reference</th>
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Type</th>
                            <th className="px-6 py-4 font-bold">Amount</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-slate-100">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-mono text-xs text-slate-500 font-medium">{tx.transaction_id || tx.reference}</p>
                                </td>
                                 <td className="px-6 py-4 text-sm text-slate-900">
                                    <div>
                                        <p className="font-semibold">{tx.wallet?.user ? `${tx.wallet.user.first_name} ${tx.wallet.user.last_name}` : 'Guest/System'}</p>
                                        <p className="text-xs text-slate-500">{tx.wallet?.user?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                                        tx.type === 'Purchase' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        tx.type === 'Withdrawal' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        tx.type === 'Refund' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                     }`}>
                                        {tx.type}
                                     </span>
                                </td>
                                <td className={`px-6 py-4 font-mono font-bold text-sm ${
                                    ['Purchase', 'Deposit', 'Refund'].includes(tx.type) ? 'text-emerald-600' : 'text-slate-900'
                                }`}>
                                    {['Withdrawal', 'Debit'].includes(tx.type) ? '-' : '+'}{formatCurrency(tx.total_amount)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                        tx.status === 'payment_successful' ? 'bg-emerald-50 text-emerald-700' : 
                                        ['pending_confirmation', 'pending'].includes(tx.status) ? 'bg-amber-50 text-amber-700' : 
                                        'bg-red-50 text-red-700'
                                    }`}>
                                        {tx.status === 'payment_successful' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                                         ['pending_confirmation', 'pending'].includes(tx.status) ? <Clock className="w-3.5 h-3.5" /> : 
                                         <XCircle className="w-3.5 h-3.5" />}
                                        <span className="capitalize">{tx.status.replace(/_/g, ' ')}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {new Date(tx.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
             </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
             <div className="space-y-6">
                 {/* Quick Actions / Search */}
                 <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
                     <div className="relative z-10 max-w-2xl">
                         <h2 className="text-2xl font-bold mb-2">Finance Overview</h2>
                         <p className="text-violet-100 mb-6">Quickly find transactions or managing pending payouts.</p>
                         
                         <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search all transactions by ID, User, or Email..." 
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
                                onKeyDown={handleQuickSearch}
                            />
                         </div>
                     </div>
                     <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right" />
                 </div>

                 {/* Recent Activity Summary */}
                 <div>
                     <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="font-bold text-slate-900">Recent Activity</h3>
                        <button onClick={() => setActiveTab('transactions')} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                            View All &rarr;
                        </button>
                     </div>
                     <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">User</th>
                                    <th className="px-6 py-3 font-semibold">Type</th>
                                    <th className="px-6 py-3 font-semibold">Amount</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                                            {tx.wallet?.user?.first_name || 'System'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-500">{tx.type}</td>
                                        <td className={`px-6 py-3 text-sm font-mono font-bold ${
                                            ['Withdrawal', 'Debit'].includes(tx.type) ? 'text-slate-900' : 'text-emerald-600'
                                        }`}>
                                            {formatCurrency(tx.total_amount)}
                                        </td>
                                         <td className="px-6 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                                tx.status === 'payment_successful' ? 'bg-emerald-50 text-emerald-700' : 
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {tx.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-slate-400">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
}
