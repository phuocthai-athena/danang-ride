"use client";

import dynamic from "next/dynamic";

const FlipBook = dynamic(() => import("@/components/FlipBook"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-b from-slate-900 to-slate-800">
      <div className="animate-pulse text-white/60">Loading...</div>
    </div>
  ),
});

export default function ClientFlipBook() {
  return <FlipBook />;
}
