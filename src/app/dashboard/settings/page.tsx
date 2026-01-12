"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/api/user";
import { User, Lock, Bell, ShieldCheck } from "lucide-react"; // ShieldCheck Added
import { useRouter } from "next/navigation";
import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import PasswordSettings from "./components/PasswordSettings";
import PinSettings from "./components/PinSettings";
import KycSettings from "./components/KycSettings";

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'verification'>('profile');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
             // ... existing fetch logic
            try {
                const res = await userApi.getUser();
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center transition-colors border-b-2 ${activeTab === 'profile' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <User className="w-4 h-4" /> Profile
                            </div>
                        </button>
                         <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center transition-colors border-b-2 ${activeTab === 'notifications' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Bell className="w-4 h-4" /> Notifications
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center transition-colors border-b-2 ${activeTab === 'security' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                             <div className="flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> Security
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveTab('verification')}
                            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center transition-colors border-b-2 ${activeTab === 'verification' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                             <div className="flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Verification
                            </div>
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'profile' && (
                            <ProfileSettings user={user} onUserUpdate={setUser} />
                        )}
                        
                        {activeTab === 'notifications' && (
                            <NotificationSettings user={user} onUserUpdate={setUser} />
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-12">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">Password</h2>
                                    <PasswordSettings />
                                </div>
                                <div className="border-t border-gray-100 pt-10">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">Transaction PIN</h2>
                                    <PinSettings />
                                </div>
                            </div>
                        )}

                        {activeTab === 'verification' && (
                            <KycSettings user={user} onUserUpdate={setUser} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
