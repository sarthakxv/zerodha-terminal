"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-accent text-4xl font-bold tracking-widest">ZT</h1>
        <p className="text-text-muted text-sm">Zerodha Terminal</p>
      </div>

      {error && (
        <div className="bg-loss/10 border border-loss/20 text-loss text-xs px-4 py-2 rounded">
          {error === "missing_token"
            ? "Login failed — missing token."
            : error === "auth_failed"
              ? "Authentication failed. Try again."
              : "Session expired. Please log in again."}
        </div>
      )}

      <a
        href="/api/auth/login"
        className="bg-accent text-black font-bold text-sm px-8 py-3 rounded hover:brightness-110 transition-all tracking-wide"
      >
        LOGIN WITH KITE
      </a>

      <p className="text-text-dim text-xs max-w-xs text-center">
        Redirects to Zerodha for authentication. Sessions expire daily at 6:00
        AM IST.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-bg-primary">
          <h1 className="text-accent text-4xl font-bold tracking-widest">ZT</h1>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
