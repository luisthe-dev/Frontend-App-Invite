"use client";

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/api/auth';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
  
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
      password: '',
      confirmPassword: ''
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
      }
  
      if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          setLoading(false);
          return;
      }
  
      try {
        await authService.resetPassword(tokenParam || '', emailParam, formData.password);
        setSuccess(true);
        setTimeout(() => {
            router.push('/signin');
        }, 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to reset password. Please try again or request a new code.');
      } finally {
          setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white py-10 px-6 shadow-xl sm:rounded-2xl sm:px-12 border border-gray-100">
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 text-violet-600">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Create a new secure password
              </p>
            </div>
  
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      {error}
                  </div>
              )}
  
              {success && (
                  <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-100 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Password reset successful! Redirecting to login...
                  </div>
              )}
  
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all sm:text-sm pr-10"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
  
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all sm:text-sm pr-10"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
                </button>
              </div>
  
            </form>
            
             <div className="mt-8 flex items-center justify-center border-t border-gray-100 pt-6">
                  <Link href="/signin" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
                  </Link>
              </div>
  
          </div>
        </div>
      </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
