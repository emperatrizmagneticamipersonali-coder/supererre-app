import { AppNav } from "@/components/app/AppNav";
import { SesionTracker } from "@/components/app/SesionTracker";
import { PlanSync } from "@/components/app/PlanSync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-base">
      <SesionTracker />
      <PlanSync />
      <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
      <AppNav />
    </div>
  );
}
