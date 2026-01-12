import { useState } from "react";
import { authService } from "@/api/auth";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PasswordSettings() {
    const router = useRouter();
    const [data, setData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (data.new_password !== data.confirm_password) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (data.new_password.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setUpdating(true);

        try {
            await authService.changePassword({
                current_password: data.current_password,
                new_password: data.new_password
            });
            setMessage({ type: 'success', text: 'Password changed successfully. Please log in again.' });
            setData({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => {
                authService.logout();
                router.push('/signin');
            }, 2000);
        } catch (error: any) {
             setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-yellow-800 mb-1">Secure your account</h3>
                <p className="text-xs text-yellow-700">Make sure to use a strong password including numbers and special characters.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                    type="password" 
                    required
                    value={data.current_password}
                    onChange={(e) => setData({...data, current_password: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                    type="password" 
                    required
                    minLength={8}
                    value={data.new_password}
                    onChange={(e) => setData({...data, new_password: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                    type="password" 
                    required
                    minLength={8}
                    value={data.confirm_password}
                    onChange={(e) => setData({...data, confirm_password: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                />
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
                            Updating...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" /> Update Password
                        </>
                    )}
                </button>
            </div>

        </form>
    );
}
