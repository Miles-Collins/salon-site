"use client";

import { useEffect } from "react";

export default function GlossGeniusWidget() {
  useEffect(() => {
    const script = document.createElement("script");
  script.src = "https://static.glossgenius.com/gg-booking.js";
  script.setAttribute("data-gg-embed", "https://porschacradic.glossgenius.com");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full">
      {/* GlossGenius injects its embed content here automatically */}
    </div>
  );
}
