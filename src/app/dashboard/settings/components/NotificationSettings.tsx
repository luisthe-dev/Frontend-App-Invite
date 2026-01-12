import { useState, useEffect } from "react";
import { userApi } from "@/api/user";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

interface NotificationSettingsProps {
    user: any;
    onUserUpdate: (user: any) => void;
}

export default function NotificationSettings({ user, onUserUpdate }: NotificationSettingsProps) {
    const [prefs, setPrefs] = useState({
        email_marketing: true,
        email_security: true,
        email_transactional: true
    });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.notification_preferences) {
            setPrefs(user.notification_preferences);
        }
    }, [user]);

    const handleUpdate = async () => {
        setMessage(null);
        setUpdating(true);

        try {
            await userApi.updateProfile({ notification_preferences: prefs });
            setMessage({ type: 'success', text: 'Notification preferences saved' });
            onUserUpdate({ ...user, notification_preferences: prefs });
        } catch (error: any) {
             setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save preferences' });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-lg space-y-8">
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-violet-800 mb-1">Stay Updated</h3>
                <p className="text-xs text-violet-700">Manage how you receive updates and alerts from MyInvite.</p>
            </div>

            <div className="space-y-6">
                {/* Marketing Emails */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-500">Receive news, updates, and special offers.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={prefs.email_marketing} 
                            onChange={(e) => setPrefs({...prefs, email_marketing: e.target.checked})}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                </div>

                {/* Transactional Emails */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-900">Transactional Emails</h4>
                        <p className="text-sm text-gray-500">Receive purchase receipts and ticket details.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={prefs.email_transactional} 
                            onChange={(e) => setPrefs({...prefs, email_transactional: e.target.checked})}
                            className="sr-only peer" 
                        />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                </div>

                {/* Security Alerts */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">Security Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified about logins and profile changes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={prefs.email_security} 
                            onChange={(e) => setPrefs({...prefs, email_security: e.target.checked})}
                            className="sr-only peer" 
                        />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button 
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {updating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" /> Save Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
