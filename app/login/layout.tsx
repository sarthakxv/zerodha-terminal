import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Zerodha Terminal",
  description:
    "Log in with your Zerodha Kite account to access your portfolio, orders, and analytics.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
