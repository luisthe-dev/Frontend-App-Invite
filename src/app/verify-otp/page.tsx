"use client";

import Link from 'next/link';
import { useState, useRef, useEffect, Suspense } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/api/auth';
import Cookies from "js-cookie";

const VerifyOtpContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email] = useState(emailParam || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP
    const [error, setError] = useState('');
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [resendLoading, setResendLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    /* Timer Logic */
    useEffect(() => {
      if (!timeLeft) return;
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }, [timeLeft]);
  
    useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, []);
  
    const handleChange = (index: number, value: string) => {
      // Allow only numbers
      if (value && !/^\d+$/.test(value)) return;
  
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    };
  
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };
    
    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
      if (pastedData.every(char => /^\d$/.test(char))) {
          const newOtp = [...otp];
          pastedData.forEach((char, index) => {
              if (index < 6) newOtp[index] = char;
          });
          setOtp(newOtp);
          inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      const token = otp.join('');
      if (token.length !== 6) {
          setError('Please enter a complete 6-digit code');
          setLoading(false);
          return;
      }
  
      try {
        const response = await authService.verifyToken(token, email);
        setSuccess(true);

        // If the backend returns a new token (upgraded to 'User' scope), update cookies
        if (response && response.access_token) {
          Cookies.set("token", response.access_token, { expires: 30 });
          if (response.user) {
            Cookies.set("user", JSON.stringify(response.user), {
              expires: 30,
            });
          }
        }

        setTimeout(() => {
          const flow = searchParams.get("flow");
          if (flow === "signup") {
            router.push("/auth/setup-profile");
          } else {
            router.push(`/reset-password?token=${token}&email=${email}`);
          }
        }, 1500);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Verification failed. Invalid or expired token.');
      } finally {
          setLoading(false);
      }
    };
  
    const handleResend = async () => {
        if (timeLeft > 0) return;

        setResendLoading(true);
        setError("");

        try {
          await authService.resendToken();
          setSuccess(false); // Reset success state if any
          setTimeLeft(30); // Reset timer
          setError(""); // Clear errors
          // Optional: Show toast or success message for resend
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to resend code");
        } finally {
          setResendLoading(false);
        }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-slate-900 py-10 px-6 shadow-xl sm:rounded-2xl sm:px-12 border border-gray-100 dark:border-slate-800">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield-check"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Enter Verification Code
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 text-center">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-900 dark:text-slate-200">
                  {email || "your email"}
                </span>
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 flex justify-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Dev Mode: Use 123456
                  </span>
                </div>
              )}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm p-3 rounded-lg border border-green-100 dark:border-green-900/30 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified successfully! Redirecting...
                </div>
              )}

              <div className="flex justify-center gap-2 my-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-slate-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0 || resendLoading}
                  className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Resending...
                    </span>
                  ) : timeLeft > 0 ? (
                    `Resend in ${timeLeft}s`
                  ) : (
                    "Resend"
                  )}
                </button>
              </p>
            </form>

            <div className="mt-8 flex items-center justify-center border-t border-gray-100 dark:border-slate-800 pt-6">
              <Link
                href="/signin"
                className="flex items-center text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>}>
            <VerifyOtpContent />
        </Suspense>
    )
}
