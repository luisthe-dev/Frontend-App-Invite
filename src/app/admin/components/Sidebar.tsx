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
import { ThemeToggle } from "@/components/ThemeToggle";

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
      { href: "/admin/settings/trust", label: "Trust Score", icon: ShieldCheck },
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
    <aside className="w-64 bg-card border-r border-border min-h-screen hidden md:flex flex-col shadow-sm z-10 transition-colors">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="bg-primary p-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground tracking-tight">
          Admin
          <span className="text-primary">Portal</span>
        </span>
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
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSubmenuActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
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
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1">
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
                              ? "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 font-bold"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
                          )}
                        >
                          <SubIcon
                            className={cn(
                              "w-3.5 h-3.5",
                              isSubActive
                                ? "text-violet-600 dark:text-violet-400"
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
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-600 dark:bg-violet-500 rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Administrator
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@myinvite.app
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
