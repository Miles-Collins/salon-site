import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

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
  const content = (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        {publishableKey ? (
          <ClerkProvider
            publishableKey={publishableKey}
            clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
          >
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
