"use client";

import { useState } from "react";
import { adminApi } from "@/api/admin";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddTierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (tier: any) => void;
}

export default function AddTierModal({ isOpen, onClose, onSuccess }: AddTierModalProps) {
    const [newTier, setNewTier] = useState({
        name: '',
        min_score: 0,
        max_score: 100,
        withdrawal_percent: 0,
        days_prior: 0
    });
    const [creatingTier, setCreatingTier] = useState(false);

    const handleCreateTier = async () => {
        try {
            setCreatingTier(true);
            const res = await adminApi.createTrustTier(newTier);
            onSuccess(res);
            onClose();
            setNewTier({ name: '', min_score: 0, max_score: 100, withdrawal_percent: 0, days_prior: 0 });
            toast.success("Tier created successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create tier");
        } finally {
            setCreatingTier(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add New Tier</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tier Name</label>
                        <input 
                            type="text" 
                            value={newTier.name}
                            onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                            placeholder="e.g. VIP Host"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Min Score</label>
                            <input 
                                type="number" 
                                value={newTier.min_score}
                                onChange={(e) => setNewTier({...newTier, min_score: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Score</label>
                            <input 
                                type="number" 
                                value={newTier.max_score}
                                onChange={(e) => setNewTier({...newTier, max_score: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Withdrawal %</label>
                            <input 
                                type="number" 
                                value={newTier.withdrawal_percent}
                                onChange={(e) => setNewTier({...newTier, withdrawal_percent: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Days Prior</label>
                            <input 
                                type="number" 
                                value={newTier.days_prior}
                                onChange={(e) => setNewTier({...newTier, days_prior: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateTier}
                        disabled={creatingTier || !newTier.name}
                        className="px-4 py-2 text-sm font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {creatingTier ? 'Creating...' : 'Create Tier'}
                    </button>
                </div>
            </div>
        </div>
    );
}
