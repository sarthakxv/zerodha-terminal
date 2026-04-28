"use client";

import TopBar from "./TopBar";
import IconRail from "./IconRail";
import SessionExpired from "@/components/shared/SessionExpired";
import { useAuth } from "@/components/providers/QueryProvider";

export default function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const { isSessionExpired } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-primary">
      <TopBar userName={userName} />
      <div className="flex flex-1 overflow-hidden">
        <IconRail />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
      {isSessionExpired && <SessionExpired />}
    </div>
  );
}
