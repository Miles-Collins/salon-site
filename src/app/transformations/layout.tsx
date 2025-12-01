import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transformations | Color Rebel by Porscha",
  description: "Dramatic before & after transformations showcasing vibrant color work, precision cuts, and stunning hair makeovers.",
  openGraph: {
    title: "Hair Transformations",
    description: "Before & after gallery of stunning color transformations.",
    images: [{
      url: "https://colorrebelbyporscha.com/api/og?page=gallery",
      width: 1200,
      height: 630,
    }],
  },
};

export default function TransformationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
