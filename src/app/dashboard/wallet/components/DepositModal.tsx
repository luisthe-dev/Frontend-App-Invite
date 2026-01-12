import { useState } from "react";
import { walletApi } from "@/api/wallet";
import { ArrowDownLeft, X, Loader2 } from "lucide-react";

import { useToast } from "@/context/ToastContext";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const { error } = useToast();
    const [amount, setAmount] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const res = await walletApi.deposit(Number(amount));
            // Redirect to Paystack
            window.location.href = res.data.payment_url;
        } catch (err: any) {
            error(err.response?.data?.message || 'Deposit failed');
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <ArrowDownLeft className="w-5 h-5 text-violet-600"/> Fund Wallet
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <form onSubmit={handleDeposit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Deposit</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                            <input 
                                type="number" 
                                required
                                min="100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none font-bold text-lg"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
