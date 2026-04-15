"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import { authService } from '@/api/auth';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (authService.isAuthenticated()) {
      if (user?.status === "Unverified") {
        router.push(`/verify-otp?email=${encodeURIComponent(user.email_address || user.email)}&flow=login`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!agreed) {
        setError("You must agree to the Terms of Service and Privacy Policy");
        setLoading(false);
        return;
    }

    // Split Full Name into First and Last Name
    const names = fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || ''; // Handle cases with only one name entered

    try {
      await authService.register({
          first_name: firstName,
          last_name: lastName || firstName, // Fallback if no last name
          email: email,
          password: password,
      });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <Card>
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Image
                src={resolvedTheme === 'dark' ? '/Logos/web_logo_dark_mode.png' : '/Logos/web_logo_light_mode.png'}
                alt="MyInvite"
                width={200}
                height={60}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Sign Up
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
              Create your account to start booking events
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <Input
              id="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Password must be at least 8 characters with a mix of letters,
                numbers, and symbols
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreed"
                  name="agreed"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer bg-white dark:bg-slate-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="agreed"
                  className="font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full shadow-violet-200 shadow-lg"
            >
              Create Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => authService.socialLogin("google")}
                className="flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
            >
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
