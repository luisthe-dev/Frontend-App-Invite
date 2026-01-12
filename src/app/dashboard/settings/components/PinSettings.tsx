import { useState, useEffect } from "react";
import { userApi } from "@/api/user";
import { Shield, KeyRound, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function PinSettings() {
    const [data, setData] = useState({
        current_password: '',
        new_pin: '',
        confirm_pin: ''
    });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [hasPassword, setHasPassword] = useState(true);

    const checkUserStatus = async () => {
        try {
            const userData = await userApi.getUser();
            if (userData.data && userData.data.has_password !== undefined) {
                 setHasPassword(userData.data.has_password);
            } else if (userData.has_password !== undefined) {
                 setHasPassword(userData.has_password);
            }
        } catch (e) {
            console.error("Failed to check user password status", e);
        }
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (data.new_pin !== data.confirm_pin) {
            setMessage({ type: 'error', text: 'PINs do not match' });
            return;
        }

        if (data.new_pin.length !== 4) {
            setMessage({ type: 'error', text: 'PIN must be exactly 4 digits' });
            return;
        }

        setUpdating(true);

        try {
            const payload: any = {
                new_pin: data.new_pin
            };
            
            if (hasPassword) {
                payload.current_password = data.current_password;
            }

            await userApi.updatePin(payload);
            setMessage({ type: 'success', text: 'Transaction PIN updated successfully' });
            setData({ current_password: '', new_pin: '', confirm_pin: '' });
        } catch (error: any) {
             setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update PIN' });
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
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4"/> Transaction Security
                </h3>
                <p className="text-xs text-blue-700">Your 4-digit PIN is required for withdrawals and sensitive wallet actions.</p>
            </div>

            {hasPassword && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                        type="password" 
                        required
                        value={data.current_password}
                        onChange={(e) => setData({...data, current_password: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                        placeholder="Enter login password to confirm"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
                    <input 
                        type="password" 
                        required
                        maxLength={4}
                        value={data.new_pin}
                        onChange={(e) => setData({...data, new_pin: e.target.value.replace(/\D/g,'')})}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-center tracking-widest"
                        placeholder="••••"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
                    <input 
                        type="password" 
                        required
                        maxLength={4}
                        value={data.confirm_pin}
                        onChange={(e) => setData({...data, confirm_pin: e.target.value.replace(/\D/g,'')})}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-center tracking-widest"
                        placeholder="••••"
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
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <KeyRound className="w-4 h-4" /> Set Transaction PIN
                        </>
                    )}
                </button>
            </div>

        </form>
    );
}
