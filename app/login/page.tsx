"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERROR_LABEL: Record<string, string> = {
  missing_token: "Authentication aborted — no token returned.",
  auth_failed: "Authentication failed. Try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorMsg = errorCode
    ? ERROR_LABEL[errorCode] ?? "Session expired. Please log in again."
    : null;

  return (
    <div className="relative min-h-screen flex flex-col bg-bg-primary text-text-primary font-sans">
      {/* Dot-grid background — the one moment of texture on this page */}
      <div className="absolute inset-0 dot-grid-subtle opacity-40 pointer-events-none" />

      {/* Top label bar — instrument-panel cue */}
      <div className="relative z-10 flex items-center justify-between px-6 h-11 border-b border-border">
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          ZT / Terminal · Build 0.1
        </span>
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          IST · Asia/Kolkata
        </span>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: hero wordmark */}
          <div className="lg:col-span-7">
            <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-accent">
              / Authentication required
            </div>
            <h1
              className="mt-6 font-display font-medium text-[160px] leading-[0.85] tracking-[-0.04em] text-text-display"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ZT
            </h1>
            <p className="mt-8 text-[15px] leading-relaxed text-text-secondary max-w-md">
              A personal trading terminal for Zerodha Kite. Read-only by design.
              Sessions expire daily at 06:00 IST.
            </p>
          </div>

          {/* Right: action panel */}
          <div className="lg:col-span-5">
            <div className="border border-border-visible bg-bg-surface">
              <div className="px-6 py-4 border-b border-border flex items-baseline justify-between">
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-text-secondary">
                  Sign in
                </span>
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-muted">
                  / Step 1
                </span>
              </div>

              <div className="px-6 py-7">
                <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
                  Provider
                </div>
                <div className="mt-2 text-text-display text-[20px] font-medium leading-tight">
                  Zerodha Kite
                </div>
                <div className="mt-1 text-text-muted text-[12px]">
                  OAuth · access_token via Kite Connect
                </div>

                {errorMsg && (
                  <div className="mt-6 border border-accent-line bg-accent-soft px-4 py-3 flex items-start gap-3">
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent shrink-0">
                      Err
                    </span>
                    <span className="text-text-primary text-[12px]">
                      {errorMsg}
                    </span>
                  </div>
                )}

                <a
                  href="/api/auth/login"
                  className="mt-7 w-full inline-flex items-center justify-between px-5 py-4 bg-text-display text-bg-primary font-mono text-[11px] tracking-[0.18em] uppercase hover:bg-accent hover:text-text-display transition-colors"
                >
                  <span>Continue with Kite</span>
                  <span aria-hidden className="text-[16px]">
                    →
                  </span>
                </a>

                <div className="mt-6 pt-5 border-t border-border flex items-baseline justify-between">
                  <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted">
                    Session
                  </span>
                  <span className="font-mono text-[10px] text-text-secondary">
                    expires 06:00 IST
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim">
              By continuing, you authorize redirect to kite.zerodha.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-border px-6 h-9 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-dim">
          v 0.1 · Personal · Read-only
        </span>
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-dim">
          ●●● Encrypted cookie
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-bg-primary">
          <span
            className="font-display text-[64px] tracking-[-0.03em] text-text-display"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ZT
          </span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
