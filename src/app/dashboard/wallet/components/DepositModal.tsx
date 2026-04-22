import { useState, useEffect } from "react";
import { walletApi } from "@/api/wallet";
import { eventsApi } from "@/api/events";
import { ArrowDownLeft, X, Loader2, CreditCard, Globe, Building2, ShieldCheck } from "lucide-react";

import { useToast } from "@/context/ToastContext";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const { error } = useToast();
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("paystack");
    const [processing, setProcessing] = useState(false);
    const [publicSettings, setPublicSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await eventsApi.getPublicSettings();
                setPublicSettings(settings);
                
                // If current selected method is disabled, pick the first enabled one
                const methods = [
                    { id: "paystack", enabled: settings.payment_paystack_enabled },
                    { id: "flutterwave", enabled: settings.payment_flutterwave_enabled },
                    { id: "korapay", enabled: settings.payment_korapay_enabled },
                    { id: "monnify", enabled: settings.payment_monnify_enabled },
                    { id: "opay", enabled: settings.payment_opay_enabled },
                ];
                
                if (!settings[`payment_${selectedMethod}_enabled`]) {
                    const firstEnabled = methods.find(m => m.enabled);
                    if (firstEnabled) {
                        setSelectedMethod(firstEnabled.id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch public settings", err);
            }
        };
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const res = await walletApi.deposit(Number(amount), selectedMethod);
            // Redirect to Payment URL
            window.location.href = res.payment_url;
        } catch (err: any) {
            error(err.response?.data?.message || 'Deposit failed');
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-violet-600 dark:text-violet-400" />{" "}
              Fund Wallet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleDeposit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₦
                </span>
                <input
                  type="number"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none font-bold text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800">
                {[
                  { 
                    id: "paystack", 
                    name: "Paystack", 
                    icon: <CreditCard className="w-5 h-5" />, 
                    desc: "Card, Bank Transfer",
                    enabled: !publicSettings || publicSettings.payment_paystack_enabled 
                  },
                  { 
                    id: "flutterwave", 
                    name: "Flutterwave", 
                    icon: <Globe className="w-5 h-5" />, 
                    desc: "Card, USSD, QR Code",
                    enabled: !publicSettings || publicSettings.payment_flutterwave_enabled 
                  },
                  { 
                    id: "korapay", 
                    name: "Korapay", 
                    icon: <CreditCard className="w-5 h-5" />, 
                    desc: "Card, Bank Transfer",
                    enabled: !publicSettings || publicSettings.payment_korapay_enabled 
                  },
                  { 
                    id: "monnify", 
                    name: "Monnify", 
                    icon: <Building2 className="w-5 h-5" />, 
                    desc: "Account Transfer, Card",
                    enabled: !publicSettings || publicSettings.payment_monnify_enabled 
                  },
                  { 
                    id: "opay", 
                    name: "Opay Cashier", 
                    icon: <ShieldCheck className="w-5 h-5" />, 
                    desc: "Opay Wallet, Card",
                    enabled: !publicSettings || publicSettings.payment_opay_enabled 
                  },
                ].filter(m => m.enabled).map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-4 p-4 text-left rounded-xl border transition-all ${
                      selectedMethod === method.id
                        ? "border-violet-600 bg-violet-50 dark:bg-violet-900/10 ring-1 ring-violet-600"
                        : "border-gray-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className={`${
                      selectedMethod === method.id ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${
                        selectedMethod === method.id ? "text-violet-600 dark:text-violet-400" : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {method.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        {method.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </form>
        </div>
      </div>
    );
}
