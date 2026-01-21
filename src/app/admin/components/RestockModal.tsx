"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
  ticketTitle?: string;
}

export default function RestockModal({
  isOpen,
  onClose,
  onConfirm,
  ticketTitle,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState("10");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) return;

    setLoading(true);
    try {
      await onConfirm(qty);
      onClose();
      setQuantity("10"); // Reset
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Restock ${ticketTitle || "Ticket"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Quantity to Add
          </label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-slate-500 mt-2">
            This will increase the available stock immediately.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
             {loading && <Loader2 className="w-4 h-4 animate-spin" />}
             Restock
          </button>
        </div>
      </form>
    </Modal>
  );
}
