"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { authService } from "@/api/auth";

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing login...");

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Handle error (maybe redirect back to login with error)
      const message = searchParams.get("message");
      router.push(`/signin?error=${error}&message=${message}`);
      return;
    }

    (async () => {
      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));

          // Store in Cookies
          Cookies.set("token", token, { expires: 30 });
          Cookies.set("user", JSON.stringify(user), { expires: 30 });

          setStatus("Login successful! Redirecting...");

          setTimeout(async () => {
            const isNew = searchParams.get("is_new") === "true";

            try {
              if (user.status === "Unverified") {
                router.push("/verify-otp?flow=login");
              } else if (isNew) {
                router.push("/auth/setup-profile");
              } else {
                router.push("/dashboard");
              }
            } catch (e) {
              setStatus(
                "Error processing login, redirecting to login page ...",
              );
              console.error("Failed to parse user data", e);
              await authService.logout();
              setTimeout(() => {
                router.push("/signin");
              }, 5000);
            }
          }, 2000);
        } catch (e) {
          setStatus("Error processing login, redirecting to login page ...");
          console.error("Failed to parse user data", e);
          await authService.logout();
          setTimeout(() => {
            router.push("/signin");
          }, 5000);
        }
      } else {
        setStatus("Error processing login, redirecting to login page ...");
        await authService.logout();
        setTimeout(() => {
          router.push("/signin");
        }, 5000);
      }
    })();
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
