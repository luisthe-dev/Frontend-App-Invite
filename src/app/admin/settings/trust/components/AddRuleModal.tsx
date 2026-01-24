"use client";

import { useState } from "react";
import { adminApi } from "@/api/admin";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (rule: any) => void;
}

export default function AddRuleModal({ isOpen, onClose, onSuccess }: AddRuleModalProps) {
    const [newRule, setNewRule] = useState({
        key: '',
        value: 0,
        description: '',
        type: 'gain' as 'gain' | 'penalty'
    });
    const [creatingRule, setCreatingRule] = useState(false);

    const handleCreateRule = async () => {
        try {
            setCreatingRule(true);
            const res = await adminApi.createTrustScoreSetting(newRule);
            onSuccess(res);
            onClose();
            setNewRule({ key: '', value: 0, description: '', type: 'gain' });
            toast.success("Rule created successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create rule");
        } finally {
            setCreatingRule(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add New Rule</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                        <div>
                        <label className="block text-sm font-medium mb-1">Rule Type</label>
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <button 
                                onClick={() => setNewRule({...newRule, type: 'gain'})}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${newRule.type === 'gain' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Gain (+)
                            </button>
                            <button 
                                onClick={() => setNewRule({...newRule, type: 'penalty'})}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${newRule.type === 'penalty' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Penalty (-)
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Key (Code Name)</label>
                        <input 
                            type="text" 
                            value={newRule.key}
                            onChange={(e) => setNewRule({...newRule, key: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-sm"
                            placeholder="e.g. bonus_super_host"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            {newRule.type === 'penalty' ? 'Will be prefixed with penalty_' : 'Unique identifier for the rule'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Value (Points)</label>
                        <input 
                            type="number" 
                            value={newRule.value}
                            onChange={(e) => setNewRule({...newRule, value: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                            value={newRule.description}
                            onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent resize-none"
                            rows={3}
                            placeholder="Explain when this rule applies..."
                        />
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
                        onClick={handleCreateRule}
                        disabled={creatingRule || !newRule.key || !newRule.value}
                        className="px-4 py-2 text-sm font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {creatingRule ? 'Creating...' : 'Create Rule'}
                    </button>
                </div>
            </div>
        </div>
    );
}
