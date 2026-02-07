import { useState, useEffect } from "react";
import { userApi } from "@/api/user";
import { Save, User, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileSettingsProps {
    user: any;
    onUserUpdate: (user: any) => void;
}

export default function ProfileSettings({ user, onUserUpdate }: ProfileSettingsProps) {
    const [phone, setPhone] = useState(user?.phone || "");
    const [displayName, setDisplayName] = useState(user?.display_name || "");
    const [userName, setUserName] = useState(user?.user_name || "");
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setPhone(user.phone || "");
            setDisplayName(user.display_name || "");
            setUserName(user.user_name || "");
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setUpdating(true);

        try {
            await userApi.updateProfile({ 
                phone,
                display_name: displayName,
                user_name: userName
            });
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            onUserUpdate({ ...user, phone, display_name: displayName, user_name: userName });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    };

    return (
      <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-violet-600 dark:text-violet-400">
            {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {user?.display_name || `${user?.first_name} ${user?.last_name}`}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              @{userName || user?.user_name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={user?.first_name || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={user?.last_name || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Visible to other users on the platform.
            </p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">@</span>
                <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="username"
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                />
            </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Unique identifier for your profile url.
            </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            To change your email, please contact support.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
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
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    );
}
