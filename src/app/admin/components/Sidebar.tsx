"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Settings,
  ShieldCheck,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  List,
  Lock,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/financials", label: "Financials", icon: DollarSign },
  { href: "/admin/support", label: "Support", icon: MessageSquare },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    submenu: [
      { href: "/admin/settings/categories", label: "Categories", icon: List },
      { href: "/admin/settings/security", label: "Security", icon: Lock },
      { href: "/admin/settings/config", label: "Configuration", icon: Sliders },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Settings: true, // Default open for visibility
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen hidden md:flex flex-col shadow-sm z-10">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="bg-violet-600 p-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-slate-900 tracking-tight">Admin<span className="text-violet-600">Portal</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const hasSubmenu = link.submenu && link.submenu.length > 0;
          const isActive =
            !hasSubmenu &&
            (pathname === link.href || pathname?.startsWith(link.href + "/"));
          const isSubmenuOpen = openSubmenus[link.label];
          const isSubmenuActive =
            hasSubmenu && link.submenu?.some((sub) => pathname === sub.href);

          if (hasSubmenu) {
            return (
              <div key={link.label}>
                <button
                  onClick={() => toggleSubmenu(link.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isSubmenuActive
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSubmenuActive
                          ? "text-violet-600"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    {link.label}
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isSubmenuOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-100 space-y-1">
                    {link.submenu?.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            isSubActive
                              ? "text-violet-700 bg-violet-50 font-bold"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                          )}
                        >
                          <SubIcon
                            className={cn(
                              "w-3.5 h-3.5",
                              isSubActive
                                ? "text-violet-600"
                                : "text-slate-400",
                            )}
                          />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-violet-50 text-violet-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-600 rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2">
               <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">
                   A
               </div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-900 truncate">Administrator</p>
                   <p className="text-xs text-slate-500 truncate">admin@myinvite.app</p>
               </div>
          </div>
      </div>
    </aside>
  );
}
