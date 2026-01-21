"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminApi } from "@/api/admin";
import { useToast } from "@/context/ToastContext";
import { Lock, ShieldCheck } from "lucide-react";

export default function SecurityPage() {
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // Password State
    const [passData, setPassData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passData.new_password !== passData.new_password_confirmation) {
            error("New passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await adminApi.updatePassword(passData);
            success("Password updated successfully");
            setPassData({ current_password: "", new_password: "", new_password_confirmation: "" });
        } catch (err: any) {
            error(err.response?.data?.message || "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="p-8 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                     <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Security</h1>
                     <p className="text-slate-500 mt-1">Manage your account security settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm rounded-xl h-fit">
                     <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-violet-600 shadow-sm">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                             <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                             <p className="text-xs text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                                <Input 
                                    type="password" 
                                    required 
                                    value={passData.current_password}
                                    onChange={(e) => setPassData({...passData, current_password: e.target.value})}
                                    className="bg-slate-50 focus:bg-white transition-colors h-11"
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                    <Input 
                                        type="password" 
                                        required 
                                        minLength={8}
                                        value={passData.new_password}
                                        onChange={(e) => setPassData({...passData, new_password: e.target.value})}
                                        className="bg-slate-50 focus:bg-white transition-colors h-11"
                                        placeholder="••••••••"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Min. 8 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                    <Input 
                                        type="password" 
                                        required 
                                        minLength={8}
                                        value={passData.new_password_confirmation}
                                        onChange={(e) => setPassData({...passData, new_password_confirmation: e.target.value})}
                                        className="bg-slate-50 focus:bg-white transition-colors h-11"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-6 md:flex justify-end">
                                <Button type="submit" loading={isLoading} className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all h-11 px-8 rounded-lg">
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>

                <Card className="p-0 border border-slate-200 shadow-sm rounded-xl opacity-80 cursor-not-allowed relative overflow-hidden group h-fit">
                    <div className="absolute inset-0 bg-slate-50/50 z-10"></div>
                    
                     <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                             <h2 className="text-lg font-bold text-slate-700">Two-Factor Authentication (2FA)</h2>
                             <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col gap-4">
                         <p className="text-sm text-slate-500">Protect your account by requiring an additional code when logging in from a new device.</p>
                         <div className="relative z-20">
                              <Button variant="outline" disabled className="bg-white w-full">Enable 2FA (Coming Soon)</Button>
                         </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
