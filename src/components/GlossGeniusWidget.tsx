// src/components/GlossGeniusWidget.tsx
"use client";
import Script from "next/script";

export default function GlossGeniusWidget() {
  return (
    <div className="w-full">
      <div
        data-gg-embed="https://porschacradic.glossgenius.com"
        className="min-h-[900px]"
      />
      <Script
        id="gg-booking"
        src="https://static.glossgenius.com/gg-booking.js"
        strategy="afterInteractive"
        // ↓ this reduces what your browser sends as the referrer
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
