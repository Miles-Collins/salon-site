"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyBookCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Hide on book page, owner pages, and sign-in
  const shouldHide =
    pathname === "/book" ||
    pathname.startsWith("/owner") ||
    pathname.startsWith("/sign-in");

  useEffect(() => {
    if (shouldHide) {
      setIsVisible(false);
      return;
    }

    // Show after scrolling down a bit to avoid covering hero CTAs
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHide]);

  if (shouldHide) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 md:hidden transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/book"
        className="group relative flex items-center justify-center bg-brand text-white font-semibold px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
      >
        {/* Pulse animation rings */}
        <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-20"></span>
        <span className="absolute inset-0 rounded-full bg-brand animate-pulse opacity-30"></span>
        
        {/* Button text */}
        <span className="relative z-10 flex items-center gap-2">
          Book Now
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
