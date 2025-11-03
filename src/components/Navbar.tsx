"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const bookRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60); // adjust threshold as needed
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close book dropdown on outside click or route change
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!bookRef.current) return;
      if (!bookRef.current.contains(e.target as Node)) {
        setBookOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBookOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-black/90 border-b border-black/30 shadow-lg backdrop-blur" : "bg-gradient-to-b from-black/60 to-transparent border-none"}`}
    >
      <div className="w-full flex h-16 items-center px-4 sm:px-5 md:px-6">
        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen ? "true" : "false"}
          aria-controls="mobile-menu"
          className="md:hidden mr-3 text-white/90 hover:text-brand-accent focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-0.5 group">
          {/* Desktop brand mark; hide on mobile */}
          <span className="hidden md:inline text-white drop-shadow font-light tracking-[0.15em] text-lg sm:text-xl">COLOR REBEL</span>
          <span className="hidden md:inline text-white/60 drop-shadow font-light text-lg sm:text-xl">|</span>
          <span className="hidden md:flex text-white/80 drop-shadow font-light tracking-[0.15em] text-sm sm:text-base flex-col leading-tight">
            <span>P</span>
            <span>C</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-6">
          <nav className="hidden gap-4 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group px-0 py-2 text-sm font-medium uppercase tracking-wide text-white link-underline ${active ? "after:scale-x-100" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4 relative" ref={bookRef}
               onMouseEnter={() => setBookOpen(true)} onMouseLeave={() => setBookOpen(false)}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={bookOpen ? 'true' : 'false'}
              onClick={() => setBookOpen((v) => !v)}
              className="group text-white text-sm font-semibold uppercase tracking-wide link-underline flex items-center gap-1"
            >
              Book
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${bookOpen ? "rotate-180" : ""}`}>
                <path d="M5.25 7.5L10 12.25L14.75 7.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
            {/* Dropdown */}
            <div
              className={`absolute right-0 top-10 bg-white text-black rounded-md shadow-xl border border-black/10 overflow-hidden transform origin-top transition-all duration-200 ${bookOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
              <a
                href="https://porschacradic.glossgenius.com/services"
                target="_blank"
                rel="noopener noreferrer"
                className="block whitespace-nowrap px-4 py-3 text-sm hover:bg-black/5"
              >
                Book on GlossGenius
              </a>
              <Link href="/book" className="block whitespace-nowrap px-4 py-3 text-sm hover:bg-black/5">Booking Info Page</Link>
            </div>
          </div>
        </div>
        {/* Mobile dropdown panel with smooth animation */}
        <div
          id="mobile-menu"
          className={`md:hidden absolute left-0 right-0 top-16 bg-white text-black border-t border-black/10 shadow-xl overflow-hidden origin-top transform transition-all duration-1000 ease-out 
            ${mobileOpen ? "opacity-100 scale-y-100 max-h-[70vh]" : "opacity-0 scale-y-0 max-h-0 pointer-events-none"}`}
        >
          <div className="py-3">
            {nav.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-3 uppercase tracking-[0.35em] text-sm ${idx < nav.length - 1 ? "border-b border-black/10" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="block px-5 py-3 uppercase tracking-[0.35em] text-sm">Book Now</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
