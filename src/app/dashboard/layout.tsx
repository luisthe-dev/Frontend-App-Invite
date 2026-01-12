"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-50">
                <Sidebar />
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-50 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-w-0">
                
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-40">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-gray-900">MyInvite</span>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {children}
            </main>

        </div>
    );
}
