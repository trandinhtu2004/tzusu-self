import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin | Tzusu",
  description: "Khu vuc quan tri noi dung va thanh vien cua Tzusu Self.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
