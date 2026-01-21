"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

const  AuthCallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Processing login...');

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            // Handle error (maybe redirect back to login with error)
            const message = searchParams.get('message');
            router.push(`/signin?error=${error}&message=${message}`);
            return;
        }

        if (token && userStr) {
            try {
              const user = JSON.parse(decodeURIComponent(userStr));

              // Store in Cookies
              Cookies.set("token", token, { expires: 30 }); // 30 days
              Cookies.set("user", JSON.stringify(user), { expires: 30 });

              setStatus("Login successful! Redirecting...");

              // Redirect based on new user status
              setTimeout(() => {
                const isNew = searchParams.get("is_new") === "true";
                if (isNew) {
                  router.push("/auth/setup-profile");
                } else {
                  router.push("/dashboard");
                }
              }, 1000);
            } catch (e) {
                console.error("Failed to parse user data", e);
                router.push('/signin?error=parsing_error');
            }
        } else {
             router.push('/signin?error=missing_data');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">{status}</p>
        </div>
    );
};

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-violet-600 animate-spin" /></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
