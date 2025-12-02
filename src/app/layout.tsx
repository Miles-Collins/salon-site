import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyBookCTA from "@/components/StickyBookCTA";
import ChatWidget from "@/components/ChatWidget";
import { ClerkProvider } from "@clerk/nextjs";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Color Rebel by Porscha",
  description: "Book your next style or color session with Porscha — effortless beauty made simple.",
  openGraph: {
  title: "Color Rebel by Porscha",
    description: "Effortless beauty made simple. Book your appointment today.",
    images: ["/ColorRebelTransparent.png"],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/ColorRebelTransparent.png",
    apple: "/ColorRebelTransparent.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        {publishableKey ? (
          <ClerkProvider 
            publishableKey={publishableKey as string}
            signInFallbackRedirectUrl="/owner/dashboard"
            signUpFallbackRedirectUrl="/owner/dashboard"
          >
            <ToastProvider>
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
}
