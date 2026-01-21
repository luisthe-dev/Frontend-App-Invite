"use client";

import { Toaster, toast } from "sonner";
import { ToastContext, ToastType, Toast } from "@/context/ToastContext";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We maintain this context provider to avoid breaking existing pages that use useToast()
  // but the implementation now routes to Sonner's toast()

  const addToast = (type: ToastType, message: string) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "info")
      toast.message(message); // Sonner doesn't have explicit 'info' usually, 'message' or 'info' depending on version
    else toast(message);
  };

  const success = (message: string) => toast.success(message);
  const error = (message: string) => toast.error(message);
  const info = (message: string) =>
    toast.info ? toast.info(message) : toast(message);

  // Legacy support (toasts array is empty as Sonner manages state)
  const removeToast = () => {};
  const toasts: Toast[] = [];

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info }}
    >
      {children}
      <Toaster position="top-right" richColors />
    </ToastContext.Provider>
  );
}
