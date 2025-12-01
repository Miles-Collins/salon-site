import React from "react";

export const metadata = {
  title: "Gallery | Color Rebel by Porscha",
  description: "A curated gallery of salon transformations including vivid color, balayage, and extensions.",
  openGraph: {
    title: "Salon Gallery",
    description: "Recent hair transformations at Color Rebel by Porscha.",
    images: [
      { url: "https://colorrebelbyporscha.com/api/og?page=gallery", width: 1200, height: 630, alt: "Gallery" }
    ],
    type: "website",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
