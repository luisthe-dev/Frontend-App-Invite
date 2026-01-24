import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Admin Portal - MyInvite",
  description: "Administrative Dashboard",
};

import AdminLayoutClient from "./AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
