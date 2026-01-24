import { useState } from "react";
import { Search, Filter, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TransactionListProps {
    transactions: any[];
    loading: boolean;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    typeFilter: string;
    setTypeFilter: (value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export default function TransactionList({ 
    transactions, 
    loading, 
    statusFilter, 
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery
}: TransactionListProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };



    // Filter only by search query locally (status/type handled by backend)
    const filteredTransactions = transactions.filter(tx => {
        if (!searchQuery) return true;
        return (
            tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.primary_event_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            'Wallet Transaction'.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Recent Transactions
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Credit">Credit (Money In)</option>
                <option value="Debit">Debit (Money Out)</option>
                <option value="Purchase">Purchase</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Refund">Refund</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-100 dark:bg-slate-800 rounded-full w-16"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx: any) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                        #{tx.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          {formatDate(tx.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {tx.description ? (
                          tx.description
                        ) : tx.primary_event_title &&
                          tx.primary_event_title !== "N/A" ? (
                          <span>
                            Ticket purchase for{" "}
                            <span className="font-semibold">
                              {tx.primary_event_title}
                            </span>
                          </span>
                        ) : (
                          "Wallet Transaction"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                        <span
                          className={
                            tx.type === "Credit"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-900 dark:text-gray-100"
                          }
                        >
                          {tx.type === "Credit" ? "+" : "-"}{" "}
                          {formatCurrency(tx.total_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tx.status === "successful" ||
                            tx.status === "payment_successful"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                              : tx.status === "pending" ||
                                  tx.status === "pending_payment"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                          }`}
                        >
                          {tx.status?.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <Clock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No transactions found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing recent transactions
            </span>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1 border border-gray-200 dark:border-slate-800 rounded text-sm text-gray-400 dark:text-slate-600 cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1 border border-gray-200 dark:border-slate-800 rounded text-sm text-gray-400 dark:text-slate-600 cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
