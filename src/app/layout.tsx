import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyBookCTA from "@/components/StickyBookCTA";
import ChatWidget from "@/components/ChatWidget";
import { ClerkProvider } from "@clerk/nextjs";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { ToastProvider } from "@/components/Toast";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FacebookPixel from "@/components/FacebookPixel";
import Analytics from "@/components/Analytics";
import WebVitals from "@/components/WebVitals";

export const metadata: Metadata = {
  metadataBase: new URL('https://colorrebelbyporscha.com'),
  title: {
    default: "Color Rebel by Porscha | Premier Hair Salon in Leavenworth, KS",
    template: "%s | Color Rebel by Porscha"
  },
  description: "Premier hair salon in Leavenworth, KS specializing in vivid color, precision cuts, balayage, extensions, and hair treatments. Licensed professional with 15+ years experience. Book online today.",
  keywords: ["hair salon Leavenworth KS", "hair color specialist", "balayage Leavenworth", "hair extensions", "precision haircuts", "Porscha hair stylist", "Color Rebel salon", "vivid hair color", "hair treatments", "professional hairstylist Kansas"],
  authors: [{ name: "Porscha Cradic" }],
  creator: "Porscha Cradic",
  publisher: "Color Rebel by Porscha",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://colorrebelbyporscha.com",
    siteName: "Color Rebel by Porscha",
    title: "Color Rebel by Porscha | Premier Hair Salon in Leavenworth, KS",
    description: "Licensed professional hair stylist with 15+ years experience. Specializing in vivid color, balayage, extensions & precision cuts. Book your appointment online.",
    images: [
      {
        url: "/api/og?page=home",
        width: 1200,
        height: 630,
        alt: "Color Rebel by Porscha - Premier Hair Salon"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Rebel by Porscha | Premier Hair Salon",
    description: "Licensed professional specializing in vivid color, balayage, extensions & precision cuts. 15+ years experience.",
    creator: "@colorrebelporschas",
    images: ["/api/og?page=home"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/ColorRebelTransparent.png",
    apple: "/ColorRebelTransparent.png",
  },
  verification: {
    google: "google-site-verification-code",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col bg-white text-rebel-charcoal">
        <GoogleAnalytics />
        <FacebookPixel />
        {publishableKey ? (
          <ClerkProvider 
            publishableKey={publishableKey as string}
            signInFallbackRedirectUrl="/owner/dashboard"
            signUpFallbackRedirectUrl="/owner/dashboard"
          >
            <ToastProvider>
              <Analytics />
              <WebVitals />
              {/* Unified header container: navbar + announcement banner (mobile: banner above nav) */}
              <header className="fixed top-0 left-0 w-full z-50">
                <div className="flex flex-col">
                  <div className="order-2 md:order-1">
                    <Navbar />
                  </div>
                  <div className="order-1 md:order-2">
                    <AnnouncementBanner />
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
              <StickyBookCTA />
              <ChatWidget />
            </ToastProvider>
          </ClerkProvider>
        ) : (
          <>
            <Analytics />
            <WebVitals />
            <header className="fixed top-0 left-0 w-full z-50">
              <div className="flex flex-col">
                <div className="order-2 md:order-1">
                  <Navbar />
                </div>
                <div className="order-1 md:order-2">
                  <AnnouncementBanner />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
            <StickyBookCTA />
            <ChatWidget />
          </>
        )}
      </body>
    </html>
  );
  ////
}
