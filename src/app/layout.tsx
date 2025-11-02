import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Color Rebel by Porscha",
  description: "Book your next style or color session with Porscha — effortless beauty made simple.",
  openGraph: {
  title: "Color Rebel by Porscha",
    description: "Effortless beauty made simple. Book your appointment today.",
    images: ["/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
