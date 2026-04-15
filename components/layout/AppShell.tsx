"use client";

import TopBar from "./TopBar";
import IconRail from "./IconRail";
import SessionExpired from "@/components/shared/SessionExpired";
import { useAuth } from "@/components/providers/QueryProvider";

export default function AppShell({
  children,
  userInitials,
}: {
  children: React.ReactNode;
  userInitials?: string;
}) {
  const { isSessionExpired } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar userInitials={userInitials} />
      <div className="flex flex-1 overflow-hidden">
        <IconRail />
        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
      {isSessionExpired && <SessionExpired />}
    </div>
  );
}
