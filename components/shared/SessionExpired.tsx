"use client";

export default function SessionExpired() {
  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center">
      <div className="dot-grid-subtle border border-border-visible bg-bg-primary px-12 py-14 max-w-md w-full mx-4">
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-accent">
          / Session
        </div>
        <h1
          className="mt-4 font-display text-[64px] leading-none tracking-[-0.03em] text-text-display"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Expired
        </h1>
        <p className="mt-6 text-text-secondary text-[13px] leading-relaxed max-w-sm">
          Kite resets sessions daily at 06:00 IST. Re-authenticate to continue.
        </p>
        <a
          href="/api/auth/login"
          className="mt-10 inline-flex items-center gap-3 px-6 py-3 border border-text-display bg-text-display text-bg-primary font-mono text-[10px] tracking-[0.18em] uppercase hover:bg-accent hover:border-accent hover:text-text-display transition-colors"
        >
          Log in again
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
