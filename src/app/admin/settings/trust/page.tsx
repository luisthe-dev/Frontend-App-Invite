"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import { Loader2, Save, AlertCircle, CheckCircle2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import AddTierModal from "./components/AddTierModal";
import AddRuleModal from "./components/AddRuleModal";

export default function TrustSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [tiers, setTiers] = useState<any[]>([]);
    const [settings, setSettings] = useState<any[]>([]);
    const [savingTiers, setSavingTiers] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    // Modal State
    const [showAddTier, setShowAddTier] = useState(false);
    const [showAddRule, setShowAddRule] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tiersRes, settingsRes] = await Promise.all([
                adminApi.getTrustTiers(),
                adminApi.getTrustScoreSettings()
            ]);
            setTiers(tiersRes);
            setSettings(settingsRes);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load trust settings");
        } finally {
            setLoading(false);
        }
    };

    const handleTierChange = (index: number, field: string, value: any) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setTiers(newTiers);
    };

    const handleSettingChange = (index: number, value: string) => {
        const newSettings = [...settings];
        newSettings[index] = { ...newSettings[index], value: value };
        setSettings(newSettings);
    };

    const saveTiers = async () => {
        try {
            setSavingTiers(true);
            const payload = {
                tiers: tiers.map(t => ({
                    id: t.id,
                    min_score: parseInt(t.min_score),
                    max_score: parseInt(t.max_score),
                    withdrawal_percent: parseInt(t.withdrawal_percent),
                    days_prior: parseInt(t.days_prior),
                    name: t.name // Although backend might not update name, good to verify
                }))
            };
            await adminApi.updateTrustTiers(payload);
            toast.success("Trust tiers updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update trust tiers");
        } finally {
            setSavingTiers(false);
        }
    };

    const saveSettings = async () => {
        try {
            setSavingSettings(true);
            const payload = {
                settings: settings.map(s => ({
                    key: s.key,
                    value: s.value
                }))
            };
            await adminApi.updateTrustScoreSettings(payload);
            toast.success("Gamification rules updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update rules");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleDeleteTier = async (id: number) => {
        if (!confirm("Are you sure you want to delete this tier?")) return;
        try {
            await adminApi.deleteTrustTier(id);
            setTiers(tiers.filter(t => t.id !== id));
            toast.success("Tier deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete tier");
        }
    };

    const handleDeleteRule = async (key: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;
        try {
            await adminApi.deleteTrustScoreSetting(key);
            setSettings(settings.filter(s => s.key !== key));
            toast.success("Rule deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete rule");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Trust Score Settings</h1>
                    <p className="text-muted-foreground">Manage trust tiers and gamification rules</p>
                </div>
            </div>

            {/* Trust Tiers Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Trust Tiers</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowAddTier(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Tier
                        </button>
                        <button 
                            onClick={saveTiers}
                            disabled={savingTiers}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {savingTiers ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>
                
                <Card className="overflow-hidden bg-card border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Tier Name</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Min Score</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Max Score</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Withdrawal %</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Days Prior</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tiers.map((tier, index) => (
                                    <tr key={tier.id} className="group hover:bg-accent/50">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <input 
                                                type="text" 
                                                value={tier.name} 
                                                onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                                                className="w-full px-2 py-1 rounded border border-transparent hover:border-input focus:border-ring bg-transparent focus:outline-none focus:ring-0"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="number" 
                                                value={tier.min_score} 
                                                onChange={(e) => handleTierChange(index, 'min_score', e.target.value)}
                                                className="w-20 px-2 py-1 rounded border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="number" 
                                                value={tier.max_score} 
                                                onChange={(e) => handleTierChange(index, 'max_score', e.target.value)}
                                                className="w-20 px-2 py-1 rounded border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    value={tier.withdrawal_percent} 
                                                    onChange={(e) => handleTierChange(index, 'withdrawal_percent', e.target.value)}
                                                    className="w-20 px-2 py-1 rounded border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <span className="text-muted-foreground">%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                             <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    value={tier.days_prior} 
                                                    onChange={(e) => handleTierChange(index, 'days_prior', e.target.value)}
                                                    className="w-20 px-2 py-1 rounded border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <span className="text-muted-foreground">days</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDeleteTier(tier.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

             {/* Gamification Rules Section */}
             <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Gamification Rules</h2>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setShowAddRule(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Rule
                        </button>
                        <button 
                             onClick={saveSettings}
                             disabled={savingSettings}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gains */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <h3 className="font-bold">Score Gains</h3>
                        </div>
                         <div className="space-y-4">
                            {settings.filter(s => !s.key.startsWith('penalty_') && !s.key.startsWith('constraint_')).map((setting, index) => {
                                // Find original index in full array to update correctly
                                const realIndex = settings.findIndex(s => s.key === setting.key);
                                return (
                                    <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                                        <div className="flex-1 mr-4">
                                            <p className="font-medium text-foreground text-sm whitespace-pre-wrap">{setting.description || setting.key}</p>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">{setting.key}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground font-bold text-sm">+</span>
                                            <input 
                                                type="number" 
                                                value={setting.value} 
                                                onChange={(e) => handleSettingChange(realIndex, e.target.value)}
                                                className="w-16 px-2 py-1 rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-bold text-foreground text-center"
                                            />
                                            <button 
                                                onClick={() => handleDeleteRule(setting.key)}
                                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Penalties */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center gap-2 mb-4 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            <h3 className="font-bold">Score Penalties</h3>
                        </div>
                         <div className="space-y-4">
                            {settings.filter(s => s.key.startsWith('penalty_')).map((setting, index) => {
                                const realIndex = settings.findIndex(s => s.key === setting.key);
                                return (
                                    <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                                        <div className="flex-1 mr-4">
                                            <p className="font-medium text-foreground text-sm whitespace-pre-wrap">{setting.description || setting.key}</p>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">{setting.key}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground font-bold text-sm">-</span>
                                            <input 
                                                type="number" 
                                                value={setting.value} 
                                                onChange={(e) => handleSettingChange(realIndex, e.target.value)}
                                                className="w-16 px-2 py-1 rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-destructive font-bold text-foreground text-center"
                                            />
                                            <button 
                                                onClick={() => handleDeleteRule(setting.key)}
                                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </section>

             <AddTierModal 
                isOpen={showAddTier}
                onClose={() => setShowAddTier(false)}
                onSuccess={(tier) => setTiers([...tiers, tier])}
             />

             <AddRuleModal
                isOpen={showAddRule}
                onClose={() => setShowAddRule(false)}
                onSuccess={(rule) => setSettings([...settings, rule])}
             />
        </div>
    );
}
