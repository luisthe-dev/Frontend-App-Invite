"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminApi } from "@/api/admin";
import { useToast } from "@/context/ToastContext";
import { Sliders, Save, RefreshCw } from "lucide-react";
// import { Switch } from "@headlessui/react"; // Can add headlessui or just use a simple toggle

// Simple Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            className={`${
                checked ? 'bg-emerald-500' : 'bg-slate-200'
            } relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span
                aria-hidden="true"
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
}

interface Setting {
    id: number;
    key: string;
    value: string;
    group: string;
    type: 'string' | 'boolean' | 'number' | 'json';
    description?: string;
}

export default function ConfigPage() {
    const { success, error } = useToast();
    const [settings, setSettings] = useState<Record<string, Setting[]>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await adminApi.getConfig();
            setSettings(data);
        } catch (err) {
            console.error(err);
            error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (group: string, key: string, newValue: any) => {
        setSettings(prev => {
            const groupSettings = [...(prev[group] || [])];
            const settingIndex = groupSettings.findIndex(s => s.key === key);
            if (settingIndex > -1) {
                groupSettings[settingIndex] = { ...groupSettings[settingIndex], value: String(newValue) };
            }
            return { ...prev, [group]: groupSettings };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Flatten settings to array for API
            const allSettings = Object.values(settings).flat().map(s => ({
                key: s.key,
                value: s.value
            }));

            await adminApi.updateConfig({ settings: allSettings });
            success("Settings saved successfully");
            fetchSettings(); // Refresh to ensure sync
        } catch (err) {
            console.error(err);
            error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const renderSettingInput = (setting: Setting) => {
        if (setting.type === 'boolean') {
            const isChecked = setting.value === 'true' || setting.value === '1';
            return (
                <div className="flex items-center gap-3">
                    <Toggle checked={isChecked} onChange={(checked) => handleChange(setting.group, setting.key, checked)} />
                    <span className="text-sm text-slate-500">{isChecked ? 'Enabled' : 'Disabled'}</span>
                </div>
            );
        }

        if (setting.type === 'number') {
            return (
                <Input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.group, setting.key, e.target.value)}
                    className="max-w-xs"
                />
            );
        }

        return (
            <Input
                type="text"
                value={setting.value}
                onChange={(e) => handleChange(setting.group, setting.key, e.target.value)}
                className="max-w-md"
            />
        );
    };

    const groupTitles: Record<string, string> = {
        'general': 'General Settings',
        'financial': 'Financial Configuration',
        'feature': 'Feature Flags',
        'email': 'Email Setup'
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
                    <p className="text-slate-500 mt-1">Manage global system settings and defaults.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchSettings} disabled={loading || saving} className="shadow-sm hover:shadow-md transition-all">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleSave} loading={saving} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-4">
                                <div className="h-10 bg-slate-200 rounded"></div>
                                <div className="h-10 bg-slate-200 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-8">
                    {Object.entries(settings).map(([group, groupItems]) => (
                        <Card key={group} className="p-0 border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                             <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-violet-600 shadow-sm">
                                    <Sliders className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 capitalize tracking-tight">
                                        {groupTitles[group] || group}
                                    </h2>
                                    <p className="text-xs text-slate-500">Configure {group} settings</p>
                                </div>
                            </div>

                            <div className="p-6 grid gap-8">
                                {groupItems.map(setting => (
                                    <div key={setting.key} className="grid sm:grid-cols-3 gap-2 sm:gap-8 items-start group">
                                        <div className="sm:col-span-1 pt-2">
                                            <label className="block text-sm font-semibold text-slate-800 mb-1 group-hover:text-violet-600 transition-colors">
                                                {setting.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </label>
                                            {setting.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed">{setting.description}</p>
                                            )}
                                        </div>
                                        <div className="sm:col-span-2">
                                            {renderSettingInput(setting)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
