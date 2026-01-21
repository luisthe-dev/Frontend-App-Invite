import type { Metadata } from "next";
import AdminSidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Admin Portal - MyInvite",
  description: "Administrative Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
