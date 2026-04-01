"use client";

import HTMLFlipBook from "react-pageflip";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { destinations } from "@/lib/destinations";

const Page = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className = "" }, ref) => (
  <div ref={ref} className={`page-content ${className}`}>
    {children}
  </div>
));
Page.displayName = "Page";

const allPages = [
  { id: "cover", image: "/images/0_banner.png" },
  ...destinations,
];

const DURATION = 20000;
const TICK = 100;

// Preload all images on mount
function usePreloadImages(images: string[]) {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);
}

// Timeline bar as separate component to isolate re-renders from flipbook
const TimelineBar = memo(function TimelineBar({
  total,
  currentPage,
  progress,
  playing,
  onTogglePlay,
  onGoToPage,
}: {
  total: number;
  currentPage: number;
  progress: number;
  playing: boolean;
  onTogglePlay: () => void;
  onGoToPage: (idx: number) => void;
}) {
  return (
    <div className="mb-2 flex w-full max-w-md items-center gap-1.5 px-1">
      <button
        onClick={onTogglePlay}
        className="shrink-0 rounded-full bg-white/15 p-1.5 text-white/70 transition hover:bg-white/25"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
      </button>
      <div className="flex flex-1 items-center gap-0.5">
        {Array.from({ length: total }, (_, idx) => (
          <div
            key={idx}
            onClick={() => onGoToPage(idx)}
            className="relative h-0.75 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/80"
              style={{
                width:
                  idx < currentPage
                    ? "100%"
                    : idx === currentPage
                      ? `${progress}%`
                      : "0%",
                transition:
                  idx === currentPage
                    ? "width 100ms linear"
                    : "width 300ms ease",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// Memoized flipbook to prevent re-render when timeline state changes
const FlipBookPages = memo(function FlipBookPages({
  bookRef,
  onFlip,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookRef: React.RefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFlip: (e: any) => void;
}) {
  return (
    <div className="w-full max-w-md">
      {/* @ts-expect-error - react-pageflip types */}
      <HTMLFlipBook
        ref={bookRef}
        width={380}
        height={600}
        size="stretch"
        minWidth={300}
        maxWidth={500}
        minHeight={500}
        maxHeight={750}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onFlip}
        className="flip-book"
        flippingTime={800}
        useMouseEvents={true}
        swipeDistance={30}
        maxShadowOpacity={0.5}
        drawShadow={true}
      >
        {allPages.map((page) => (
          <Page key={page.id}>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src={page.image}
                alt={page.id}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Page>
        ))}
      </HTMLFlipBook>
    </div>
  );
});

export default function FlipBook() {
  usePreloadImages(allPages.map((p) => p.image));

  // Use refs for internal tracking, state only for timeline UI
  const [barState, setBarState] = useState({ page: 0, progress: 0 });
  const [playing, setPlaying] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const progressRef = useRef(0);
  const currentPageRef = useRef(0);
  const playingRef = useRef(true);
  const isFlippingRef = useRef(false);

  const totalPages = allPages.length;

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Single interval — only updates barState, never touches flipbook
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playingRef.current || isFlippingRef.current) return;

      progressRef.current += TICK;
      const pct = Math.min((progressRef.current / DURATION) * 100, 100);
      setBarState({ page: currentPageRef.current, progress: pct });

      if (progressRef.current >= DURATION) {
        isFlippingRef.current = true;

        const flipBook = bookRef.current?.pageFlip();
        if (!flipBook) {
          isFlippingRef.current = false;
          return;
        }
        const current = flipBook.getCurrentPageIndex();
        if (current < totalPages - 1) {
          flipBook.flipNext();
        } else {
          flipBook.flip(0);
        }
      }
    }, TICK);

    return () => clearInterval(interval);
  }, [totalPages]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFlip = useCallback((e: any) => {
    const newPage = e.data;
    currentPageRef.current = newPage;
    progressRef.current = 0;
    isFlippingRef.current = false;
    setBarState({ page: newPage, progress: 0 });
  }, []);

  const togglePlay = () => setPlaying((p) => !p);

  const goToPage = (idx: number) => {
    const flipBook = bookRef.current?.pageFlip();
    if (!flipBook) return;
    isFlippingRef.current = true;
    flipBook.flip(idx);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-slate-900 to-slate-800 p-4">
      <TimelineBar
        total={totalPages}
        currentPage={barState.page}
        progress={barState.progress}
        playing={playing}
        onTogglePlay={togglePlay}
        onGoToPage={goToPage}
      />
      <FlipBookPages bookRef={bookRef} onFlip={onFlip} />
    </div>
  );
}
