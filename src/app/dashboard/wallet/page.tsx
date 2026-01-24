"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/api/user";
import { walletApi } from "@/api/wallet";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import DepositModal from "./components/DepositModal";
import WithdrawModal from "./components/WithdrawModal";
import TransactionList from "./components/TransactionList";

export default function WalletPage() {
    const router = useRouter();
    const { success, error } = useToast();
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const fetchData = async () => {
        try {
            const userRes = await userApi.getUser();
            setUser(userRes);
            
            const historyRes = await userApi.getHistory({
                status: statusFilter !== 'all' ? statusFilter : undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined
            });
            setTransactions(historyRes.data || []);
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter, typeFilter]); // Re-fetch when filters change

    useEffect(() => {
        fetchData();
        // Check for verification from URL
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('reference');
        if (ref) {
            verifyDeposit(ref);
        }
    }, []);

    const verifyDeposit = async (reference: string) => {
        try {
            setLoading(true);
            await walletApi.verifyDeposit(reference);
            fetchData();
            // Clear URL
            window.history.replaceState({}, document.title, window.location.pathname);
            success('Deposit Successful!');
        } catch (err) {
            error('Deposit verification failed or already processed.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const mainWallet = user?.wallets?.find((w: any) => w.label == 'Main Wallet') || user?.wallets?.[0];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Wallet & Transactions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your funds and view transaction history.
            </p>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl mb-10 overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-violet-200 font-medium mb-1">
                  Available Balance
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {loading ? "..." : formatCurrency(mainWallet?.balance || 0)}
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="px-6 py-2.5 bg-white text-violet-900 font-semibold rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowDownLeft className="w-4 h-4" /> Money In
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-6 py-2.5 bg-violet-800/50 text-white font-semibold rounded-xl hover:bg-violet-800 transition-colors flex items-center gap-2 border border-violet-700"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Money Out
                  </button>
                </div>
              </div>
              {/* Stats - Placeholder */}
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 min-w-[200px] hidden md:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-300">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-200">Total Credits</p>
                    <p className="font-bold text-lg">--</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg text-red-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-200">Total Debits</p>
                    <p className="font-bold text-lg">--</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl"></div>
          </div>

          <TransactionList
            transactions={transactions}
            loading={loading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <DepositModal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
          />

          <WithdrawModal
            isOpen={showWithdrawModal}
            onClose={() => setShowWithdrawModal(false)}
            onSuccess={() => {
              fetchData();
              success("Withdrawal Initiated!");
            }}
            walletBalance={mainWallet?.balance || 0}
          />
        </div>
      </div>
    );
}
