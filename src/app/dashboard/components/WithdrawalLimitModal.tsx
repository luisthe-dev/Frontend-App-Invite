"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { hostApi } from "@/api/host";
import { toast } from "sonner";
import { Lock, Info } from "lucide-react";

interface WithdrawalLimitModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawalLimitModal({ eventId, isOpen, onClose }: WithdrawalLimitModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null); // { event_id, title, withdrawable_amount }
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchLimit();
    }
  }, [isOpen, eventId]);

  const fetchLimit = async () => {
    try {
      setLoading(true);
      const res = await hostApi.getEventWithdrawalLimit(eventId);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch withdrawal limit");
      onClose(); // Close if fail
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (Number(amount) > (data?.withdrawable_amount || 0)) {
        toast.error("Amount exceeds limit");
        return;
    }

    try {
      setSubmitting(true);
      await hostApi.requestWithdrawal(eventId, Number(amount));
      toast.success("Withdrawal processed successfully. Funds credited to wallet.");
      onClose();
    } catch (error: any) {
        // Backend returns 422 with message if limit exceeded or other error
        const msg = error.response?.data?.message || "Withdrawal failed";
        toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Early Withdrawal Request">
        
        {loading ? (
             <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>
        ) : (
            <div className="space-y-6 py-4">
                <div className="bg-violet-50 border border-violet-100 text-violet-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                         <Info className="h-4 w-4 text-violet-600" />
                         <span className="font-medium">Available for Withdrawal</span>
                    </div>
                    <div className="font-bold text-2xl mt-1">
                        {formatCurrency(data?.withdrawable_amount || 0)}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount to Withdraw</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                        <Input 
                            id="amount" 
                            type="number" 
                            placeholder="0.00" 
                            className="pl-8"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Max: {formatCurrency(data?.withdrawable_amount || 0)}
                    </p>
                </div>

                {data?.withdrawable_amount <= 0 && (
                     <div className="text-xs text-amber-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Withdrawal locked. Increase Trust Score or wait for event sales.</span>
                     </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button onClick={handleWithdraw} disabled={loading || submitting || !data || data.withdrawable_amount <= 0}>
                        {submitting ? "Processing..." : "Withdraw Funds"}
                    </Button>
                </div>
            </div>
        )}
    </Modal>
  );
}
