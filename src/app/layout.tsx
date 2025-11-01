import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactBar from "@/components/ContactBar";

export const metadata: Metadata = {
  title: "Hair by Porscha",
  description: "Book your next style or color session with Porscha — effortless beauty made simple.",
  openGraph: {
    title: "Hair by Porscha",
    description: "Effortless beauty made simple. Book your appointment today.",
    images: ["/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
  <Navbar />
  <main>{children}</main>
  <Footer />
  <ContactBar />
      </body>
    </html>
  );
}
