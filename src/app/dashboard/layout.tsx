"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { Menu, X } from "lucide-react";
import { authService } from "@/api/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (!isAuthenticated) {
            router.push("/signin");
            return;
        }

        if (user?.status === "Unverified") {
            router.push(`/verify-otp?email=${encodeURIComponent(user.email_address || user.email)}&flow=login`);
        }
    }, [router]);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-50">
          <Sidebar />
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 z-50 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-40 transition-colors">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Image
              src="/Logos/web_logo_light_mode.png"
              alt="MyInvite"
              width={100}
              height={32}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/Logos/web_logo_dark_mode.png"
              alt="MyInvite"
              width={100}
              height={32}
              className="hidden dark:block"
              priority
            />
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {children}
        </main>
      </div>
    );
}
