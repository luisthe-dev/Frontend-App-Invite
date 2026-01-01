"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '@/api/auth';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-2xl sm:px-12 border border-gray-100">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 text-violet-600">
               {/* Placeholder Logo - Ticket Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-500 text-center">
               Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
                {message && (
                     <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        {message}
                    </div>
                )}
                
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all sm:text-sm"
                />
                </div>

                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
                </button>
                </div>

                <div className="flex items-center justify-center">
                    <Link href="/signin" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
                    </Link>
                </div>
            </form>
          ) : (
             <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                  <p className="text-sm text-gray-600 mb-8">
                      We sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
                  </p>
                  <div className="space-y-4">
                       <button 
                            type="button"
                            onClick={() => window.location.href = `mailto:${email}`}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all"
                       >
                           Open Email App
                       </button>

                      <Link href="/signin" className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                          Skip, I'll confirm later
                      </Link>
                  </div>
                  <div className="mt-8 border-t border-gray-100 pt-6">
                      <p className="text-xs text-gray-500">
                          Did not receive the email? <button onClick={handleSubmit} disabled={loading} className="text-violet-600 hover:text-violet-500 font-medium">Click to resend</button>
                      </p>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
