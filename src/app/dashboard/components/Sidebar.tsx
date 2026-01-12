"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, Wallet, Settings, LogOut } from "lucide-react";
import { authService } from "@/api/auth";
import clsx from "clsx";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const links = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Events", href: "/dashboard/events", icon: Calendar },
        { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await authService.logout();
        router.push("/signin");
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        M
                    </div>
                    <span className="font-bold text-xl text-gray-900">MyInvite</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                isActive 
                                    ? "bg-violet-50 text-violet-600" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-violet-600" : "text-gray-400 group-hover:text-gray-600")} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
