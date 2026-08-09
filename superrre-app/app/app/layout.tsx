import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-base">
      <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
      <AppNav />
    </div>
  );
}
