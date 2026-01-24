"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "primary";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "primary",
}: ConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
      case "warning":
        return "bg-orange-500 hover:bg-orange-600 text-white"; // Keep orange for now or define warning var
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex gap-4">
           {variant === 'danger' && (
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                   <AlertTriangle className="w-5 h-5 text-destructive" />
               </div>
           )}
           <p className="text-muted-foreground leading-relaxed pt-2">{message}</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 transition-colors ${getVariantStyles()}`}
          >
             {loading && <Loader2 className="w-4 h-4 animate-spin" />}
             {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
