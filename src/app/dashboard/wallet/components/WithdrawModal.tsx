import { useState, useEffect } from "react";
import { walletApi } from "@/api/wallet";
import { ArrowUpRight, X, Loader2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";


interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    walletBalance: number;
}

export default function WithdrawModal({ isOpen, onClose, onSuccess, walletBalance }: WithdrawModalProps) {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [banks, setBanks] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [pin, setPin] = useState("");
    const [resolvingAccount, setResolvingAccount] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [bankLoading, setBankLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setAmount("");
            setSelectedBank("");
            setAccountNumber("");
            setAccountName("");
            setPin("");
            setError("");
        }
    }, [isOpen]);

    const handleNext = async () => {
        setError("");
        if (step === 1) {
             if (Number(amount) < 100) {
                 setError(`Minimum withdrawal is ${formatCurrency(100)}`);
                 return;
             }
             if (Number(amount) > walletBalance) {
                 setError("Insufficient balance");
                 return;
             }
             // Fetch banks if not loaded
             if (banks.length === 0) {
                 setBankLoading(true);
                 try {
                     const res = await walletApi.getBanks();
                     setBanks(res.data);
                 } catch (err) {
                     setError("Failed to load banks");
                     return;
                 } finally {
                     setBankLoading(false);
                 }
             }
             setStep(2);
        } else if (step === 2) {
             if (!accountName) {
                 setError("Please resolve account first");
                 return;
             }
             setStep(3);
        }
    };

    const resolveAccount = async () => {
        if (accountNumber.length !== 10 || !selectedBank) return;
        setResolvingAccount(true);
        setError("");
        try {
            const res = await walletApi.resolveAccount(selectedBank, accountNumber);
            setAccountName(res.data.account_name);
        } catch (err) {
            setAccountName("");
            setError("Could not verify account details");
        } finally {
            setResolvingAccount(false);
        }
    };

    useEffect(() => {
        if (step === 2 && accountNumber.length === 10 && selectedBank) {
            resolveAccount();
        }
    }, [accountNumber, selectedBank]);

    const handleSubmit = async () => {
        setProcessing(true);
        setError("");
        try {
            await walletApi.withdraw({
                amount: Number(amount),
                bank_code: selectedBank,
                account_number: accountNumber,
                account_name: accountName,
                pin: pin
            });
            onSuccess();
            onClose();
        } catch (err: any) {
             setError(err.response?.data?.message || "Withdrawal failed");
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-violet-600"/> Withdraw Funds
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="p-6">
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                        <div className={`w-12 h-1 ${step >= 2 ? 'bg-violet-600' : 'bg-gray-100'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                        <div className={`w-12 h-1 ${step >= 3 ? 'bg-violet-600' : 'bg-gray-100'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <X className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
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
                                <p className="text-xs text-gray-500 mt-1">Available: {formatCurrency(walletBalance)}</p>
                            </div>
                            <button 
                                onClick={handleNext} 
                                disabled={bankLoading}
                                className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {bankLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Next'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                                <select 
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none appearance-none"
                                >
                                    <option value="">Choose a bank...</option>
                                    {banks.map((bank: any) => (
                                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                <input 
                                    type="text" 
                                    maxLength={10}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g,''))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                                    placeholder="1234567890"
                                />
                            </div>
                            
                            {resolvingAccount ? (
                                <div className="flex items-center gap-2 text-sm text-violet-600">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying account...
                                </div>
                            ) : accountName && (
                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                                    <ShieldCheck className="w-4 h-4" /> {accountName}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Back
                                </button>
                                <button 
                                    onClick={handleNext} 
                                    disabled={!accountName}
                                    className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                        {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Amount</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(Number(amount))}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Bank</span>
                                    <span className="font-medium text-gray-900">{banks.find((b: any) => b.code === selectedBank)?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Account</span>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900">{accountNumber}</div>
                                        <div className="text-xs text-gray-500">{accountName}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction PIN</label>
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g,''))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center tracking-widest text-2xl"
                                    placeholder="••••"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Back
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={processing || pin.length !== 4}
                                    className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {processing ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Confirm Withdrawal'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
