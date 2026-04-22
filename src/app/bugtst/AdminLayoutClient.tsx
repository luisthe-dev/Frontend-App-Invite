"use client";

import { useState, useEffect } from "react";
import { usePathname, notFound } from "next/navigation";
import AdminSidebar from "./components/Sidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/bugtst/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // console.log('wdmwmdk');.

  useEffect(() => {
    const validAdmin = localStorage.getItem("super_event_id");

    if (validAdmin == "angel_secret_cave_goat_hoot") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isLoginPage]);

  if (isAuthorized === false) {
    notFound();
  }

  if (isAuthorized === null && !isLoginPage) {
    return null; // Initial loading state to prevent flash
  }

  return (
    <div className="h-screen bg-muted/20 flex font-sans overflow-hidden">
      {!isLoginPage && (
        <>
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card text-card-foreground border-b border-border z-30 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">MI</div>
                    <span className="font-bold text-foreground">Admin</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </>
      )}
      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto ${!isLoginPage ? 'pt-16 md:pt-0' : ''}`}>
        {children}
      </div>
    </div>
  );
}
