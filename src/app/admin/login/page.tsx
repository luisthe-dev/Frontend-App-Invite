"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import Cookies from "js-cookie";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Assuming sonner or similar toast from user's setup

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminApi.login(formData);
      
      // Store token (using a different key than user token if needed, or same if stateless)
      // Assuming 'token' comes from response
      // We might want to separate admin token or just use 'token' if keys don't collide
      // Ideally use strictly separate cookies or names for security separation
      Cookies.set("admin_token", response.data.token, { expires: 1 }); 
      
      toast.success("Admin logged in successfully");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
              placeholder="admin@myinvite.ng"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
                Back to Website
            </Link>
        </div>
      </div>
    </div>
  );
}
