"use client";

import { useState, useEffect, Suspense } from "react";
import { userApi } from "@/api/user";
import { User, Lock, Bell, ShieldCheck } from "lucide-react"; // ShieldCheck Added
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import PasswordSettings from "./components/PasswordSettings";
import PinSettings from "./components/PinSettings";
import KycSettings from "./components/KycSettings";

function SettingsContent() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'verification'>('profile');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userApi.getUser();
                setUser(res);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Sync tab with URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'security', 'notifications', 'verification'].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    const handleTabChange = (tab: 'profile' | 'security' | 'notifications' | 'verification') => {
        setActiveTab(tab);
        router.push(`/dashboard/settings?tab=${tab}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Settings
          </h1>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-slate-800 overflow-x-auto overflow-y-hidden bg-slate-50/50 dark:bg-slate-800/50 px-2 pt-2 gap-1">
              <button
                onClick={() => handleTabChange("profile")}
                className={`flex-1 min-w-[120px] py-4 text-sm font-bold text-center transition-all bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-transparent relative top-[1px] ${activeTab === "profile" ? "text-violet-600 border-gray-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 !bg-transparent border-transparent"}`}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <User
                    className={`w-4 h-4 ${activeTab === "profile" ? "text-violet-600" : "text-slate-400 dark:text-slate-500"}`}
                  />{" "}
                  Profile
                </div>
              </button>
              <button
                onClick={() => handleTabChange("notifications")}
                className={`flex-1 min-w-[120px] py-4 text-sm font-bold text-center transition-all bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-transparent relative top-[1px] ${activeTab === "notifications" ? "text-violet-600 border-gray-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 !bg-transparent border-transparent"}`}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <Bell
                    className={`w-4 h-4 ${activeTab === "notifications" ? "text-violet-600" : "text-slate-400 dark:text-slate-500"}`}
                  />{" "}
                  Notifications
                </div>
              </button>
              <button
                onClick={() => handleTabChange("security")}
                className={`flex-1 min-w-[120px] py-4 text-sm font-bold text-center transition-all bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-transparent relative top-[1px] ${activeTab === "security" ? "text-violet-600 border-gray-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 !bg-transparent border-transparent"}`}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <Lock
                    className={`w-4 h-4 ${activeTab === "security" ? "text-violet-600" : "text-slate-400 dark:text-slate-500"}`}
                  />{" "}
                  Security
                </div>
              </button>
              <button
                onClick={() => handleTabChange("verification")}
                className={`flex-1 min-w-[120px] py-4 text-sm font-bold text-center transition-all bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-transparent relative top-[1px] ${activeTab === "verification" ? "text-violet-600 border-gray-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 !bg-transparent border-transparent"}`}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${activeTab === "verification" ? "text-violet-600" : "text-slate-400 dark:text-slate-500"}`}
                  />{" "}
                  Verification
                </div>
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "profile" && (
                <ProfileSettings user={user} onUserUpdate={setUser} />
              )}

              {activeTab === "notifications" && (
                <NotificationSettings user={user} onUserUpdate={setUser} />
              )}

              {activeTab === "security" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
                      Password
                    </h2>
                    <PasswordSettings />
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
                      Transaction PIN
                    </h2>
                    <PinSettings />
                  </div>
                </div>
              )}

              {activeTab === "verification" && (
                <KycSettings user={user} onUserUpdate={setUser} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
