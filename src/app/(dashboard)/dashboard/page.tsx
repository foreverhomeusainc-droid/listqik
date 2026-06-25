import { Suspense } from "react";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export default function DashboardListingsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-white/50">Loading dashboard...</p>}>
      <DashboardHome />
    </Suspense>
  );
}
