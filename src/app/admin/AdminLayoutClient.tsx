"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./components/Sidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-muted/20 flex font-sans">
      {!isLoginPage && <AdminSidebar />}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
