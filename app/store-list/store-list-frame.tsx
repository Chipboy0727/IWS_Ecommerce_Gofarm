"use client";

import { useEffect, useRef } from "react";

export default function StoreListFrame({ html }: { html: string }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const syncHeight = () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      frame.style.height = `${height}px`;
    };

    syncHeight();
    const timer = window.setTimeout(syncHeight, 250);
    window.addEventListener("resize", syncHeight);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", syncHeight);
    };
  }, [html]);

  const handleLoad = () => {
    const frame = frameRef.current;
    if (!frame?.contentDocument) return;
    const doc = frame.contentDocument;
    frame.style.height = `${Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)}px`;
  };

  return (
    <iframe
      ref={frameRef}
      src={html}
      title="Local Stores"
      className="h-[calc(100vh-3rem)] w-full border-0 bg-white"
      loading="eager"
      scrolling="no"
      onLoad={handleLoad}
    />
  );
}
