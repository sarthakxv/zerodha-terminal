"use client";

export default function SessionExpired() {
  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/95 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-accent text-3xl font-bold tracking-widest">ZT</h1>
        <p className="text-text-secondary text-sm">Session expired</p>
        <a
          href="/api/auth/login"
          className="bg-accent text-black font-bold text-sm px-8 py-3 rounded hover:brightness-110 transition-all tracking-wide"
        >
          LOG IN AGAIN
        </a>
      </div>
    </div>
  );
}
