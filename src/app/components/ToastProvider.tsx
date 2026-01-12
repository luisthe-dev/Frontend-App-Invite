"use client";

import { useState, useCallback } from "react";
import { ToastContext, ToastType, Toast } from "@/context/ToastContext";
import ToastComponent from "./Toast";
import { AnimatePresence } from "framer-motion";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = (message: string) => addToast("success", message);
    const error = (message: string) => addToast("error", message);
    const info = (message: string) => addToast("info", message);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
