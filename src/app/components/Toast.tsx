"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Toast as ToastType } from "@/context/ToastContext";

interface ToastProps {
    toast: ToastType;
    onRemove: (id: string) => void;
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
};

const bgColors = {
    success: "bg-white border-green-100",
    error: "bg-white border-red-100",
    info: "bg-white border-blue-100"
};

export default function Toast({ toast, onRemove }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000); // Auto dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border ${bgColors[toast.type]} min-w-[300px] pointer-events-auto backdrop-blur-sm`}
        >
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-medium text-gray-700">{toast.message}</p>
            <button 
                onClick={() => onRemove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
