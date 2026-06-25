import { Suspense } from "react";
import { VelocityClubConsole } from "@/components/dashboard/velocity-club-console";

export default function VelocityClubPage() {
  return (
    <Suspense fallback={<p className="text-sm text-white/70">Loading Velocity Club...</p>}>
      <VelocityClubConsole />
    </Suspense>
  );
}
