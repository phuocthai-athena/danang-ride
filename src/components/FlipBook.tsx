"use client";

import HTMLFlipBook from "react-pageflip";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, Pause, Play, X } from "lucide-react";
import { destinations, socialLinks } from "@/lib/destinations";

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

const DURATION = 15000;
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

// WeChat ID copy modal
function WeChatModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.wechat.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = socialLinks.wechat.id;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="#07C160" className="h-6 w-6">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.577 6.577 0 0 1-.312-2.014c0-3.619 3.383-6.56 7.557-6.56.249 0 .496.013.739.033C16.434 4.727 12.875 2.188 8.691 2.188zm5.396 14.609c-3.572 0-6.468-2.493-6.468-5.568s2.896-5.568 6.468-5.568 6.468 2.493 6.468 5.568-2.896 5.568-6.468 5.568z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">WeChat</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-sm text-gray-500">
          Copy WeChat ID and search in WeChat app
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-mono text-base tracking-wide text-gray-800">
            {socialLinks.wechat.id}
          </div>
          <button
            onClick={handleCopy}
            className={`shrink-0 rounded-lg px-4 py-3 text-sm font-medium transition ${
              copied
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="h-4 w-4" /> Copy
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// QR tap zones overlay — covers bottom ~10% of each destination page
// Order: WeChat (0-25%), LINE (25-50%), WhatsApp (50-75%), KakaoTalk (75-100%)
function QrTapZones({
  onWeChatTap,
}: {
  onWeChatTap: () => void;
}) {
  const handleTap = (app: "wechat" | "line" | "whatsapp" | "kakaotalk") => (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (app === "wechat") {
      onWeChatTap();
      return;
    }

    const link = socialLinks[app];
    if ("url" in link) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "10%",
        display: "flex",
        zIndex: 10,
      }}
    >
      <div style={{ flex: 1, cursor: "pointer" }} onClick={handleTap("wechat")} />
      <div style={{ flex: 1, cursor: "pointer" }} onClick={handleTap("line")} />
      <div style={{ flex: 1, cursor: "pointer" }} onClick={handleTap("whatsapp")} />
      <div style={{ flex: 1, cursor: "pointer" }} onClick={handleTap("kakaotalk")} />
    </div>
  );
}

// Timeline bar
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

// Memoized flipbook
const FlipBookPages = memo(function FlipBookPages({
  bookRef,
  onFlip,
  onWeChatTap,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookRef: React.RefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFlip: (e: any) => void;
  onWeChatTap: () => void;
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
        {allPages.map((page, idx) => (
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
              {/* QR tap zones on destination pages (not cover) */}
              {idx > 0 && <QrTapZones onWeChatTap={onWeChatTap} />}
            </div>
          </Page>
        ))}
      </HTMLFlipBook>
    </div>
  );
});

export default function FlipBook() {
  usePreloadImages(allPages.map((p) => p.image));

  const [barState, setBarState] = useState({ page: 0, progress: 0 });
  const [playing, setPlaying] = useState(true);
  const [showWeChat, setShowWeChat] = useState(false);

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

  const handleWeChatTap = useCallback(() => {
    setShowWeChat(true);
  }, []);

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
      <FlipBookPages
        bookRef={bookRef}
        onFlip={onFlip}
        onWeChatTap={handleWeChatTap}
      />
      {showWeChat && <WeChatModal onClose={() => setShowWeChat(false)} />}
    </div>
  );
}
