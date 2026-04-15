import AppShell from "@/components/layout/AppShell";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.accessToken) {
    redirect("/login");
  }

  const initials = session.userShortname
    ? session.userShortname.slice(0, 2).toUpperCase()
    : "ZT";

  return <AppShell userInitials={initials}>{children}</AppShell>;
}
