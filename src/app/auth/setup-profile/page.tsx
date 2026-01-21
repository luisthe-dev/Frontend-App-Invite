"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/api/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Loader2, User, CheckCircle } from "lucide-react";
import { authService } from "@/api/auth";

export default function SetupProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userApi.getUser();
                setUser(userData.data);
                // Pre-fill with current auto-generated username
                setUsername(userData.data.user_name || "");
                setDisplayName(userData.data.display_name || `${userData.data.first_name || ''} ${userData.data.last_name || ''}`.trim());
            } catch (err) {
                console.error("Failed to fetch user", err);
                // If fetching fails, maybe redirect to login or dashboard
                // router.push("/signin");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Update username using the updateProfile endpoint (which now accepts user_name)
            await userApi.updateProfile({
                user_name: username,
                display_name: displayName
            });

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update username. It might be taken.");
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        router.push("/dashboard");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
                <Card className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4 text-violet-600">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Choose your Username</h2>
                        <p className="mt-2 text-sm text-slate-500 text-center">
                            This is how you'll be identified on the platform. You can change it later in settings.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">
                                Display Name
                            </label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                                minLength={2}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                This name will be shown on your profile and events.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                                Username
                            </label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. johndoe123"
                                className="font-mono"
                                required
                                minLength={3}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Only letters, numbers, and dashes allowed.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                loading={saving}
                                className="w-full bg-violet-600 hover:bg-violet-700"
                            >
                                Continue to Dashboard
                            </Button>
                            
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
                            >
                                Skip for now
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
