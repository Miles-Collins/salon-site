"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <div
      className={`w-full sticky top-0 z-50 transition-all duration-300 backdrop-blur-md
        ${scrolled ? "bg-black/85 border-b border-gold/30 shadow-2xl" : "bg-gradient-to-b from-black/70 to-black/30 border-b border-transparent"}`}
    >
      <div className="w-full flex h-16 items-center px-4 sm:px-5 md:px-6">
        {/* Global error banner (e.g., unauthorized access) */}
        {search?.get("error") === "unauthorized" && (
          <div className="absolute left-0 right-0 top-full mt-0 bg-red-600 text-white text-sm px-4 py-2 shadow">
            Access denied: please sign in with an authorized Google account.
          </div>
        )}
        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen ? true : false}
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
          {pathname?.startsWith("/owner") ? (
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/owner/dashboard">
                    <button className="rounded bg-white text-black px-3 py-2 text-sm hover:opacity-85">Staff Portal</button>
                  </SignInButton>
                  {/* Fallback link if Clerk modal fails to render */}
                  <Link href="/sign-in" className="text-xs underline text-white">Use sign-in page</Link>
                </>
              )}
            </div>
          ) : (
            <>
              <nav className="hidden gap-4 md:flex">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative px-3 py-2 text-sm font-medium uppercase tracking-wide transition duration-200 ${active ? "text-gold-default" : "text-white/90 hover:text-white"}`}
                    >
                      {item.label}
                      {/* Animated bottom line */}
                      <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gold-default transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/book"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-default/90 text-black font-semibold uppercase tracking-wide text-sm hover:bg-gold-default hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                📅 Book Now
              </Link>
              {/* Subtle Staff Portal link on all public pages */}
              {isSignedIn ? (
                <Link href="/owner/dashboard" className="text-white/80 text-sm hover:text-white hidden sm:inline">Dashboard →</Link>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/owner/dashboard">
                  <button className="text-white/80 text-sm hover:text-white hidden sm:inline">Staff Portal</button>
                </SignInButton>
              )}
            </>
          )}
        </div>
        {/* Mobile dropdown panel with smooth animation */}
        {pathname?.startsWith("/owner") ? (
          // On owner routes, show a minimal mobile menu with Home link
          <div
            id="mobile-menu"
            className={`md:hidden absolute left-0 right-0 top-full bg-white text-black border-t border-gold/20 shadow-xl overflow-hidden origin-top transform transition-all duration-300 ease-out 
              ${mobileOpen ? "opacity-100 scale-y-100 max-h-[40vh]" : "opacity-0 scale-y-0 max-h-0 pointer-events-none"}`}
          >
            <div className="py-3">
              <Link href="/" className="block px-5 py-3 uppercase tracking-[0.35em] text-sm hover:bg-gold-default/10 transition">Home</Link>
            </div>
          </div>
        ) : (
          <div
          id="mobile-menu"
          className={`md:hidden absolute left-0 right-0 top-full bg-white text-black border-t border-gold/20 shadow-xl overflow-hidden origin-top transform transition-all duration-300 ease-out 
            ${mobileOpen ? "opacity-100 scale-y-100 max-h-[70vh]" : "opacity-0 scale-y-0 max-h-0 pointer-events-none"}`}
          >
            <div className="py-3">
              <Link href="/" className="block px-5 py-3 uppercase tracking-[0.35em] text-sm border-b border-black/10">Home</Link>
              {nav.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-5 py-3 uppercase tracking-[0.35em] text-sm ${idx < nav.length - 1 ? "border-b border-black/10" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/book" className="block px-5 py-3 uppercase tracking-[0.35em] text-sm font-bold bg-gold-default/10 border-b border-black/10 text-gold-default">
                📅 Book Now
              </Link>
              {/* Staff Portal / Dashboard link in mobile menu */}
              {isSignedIn ? (
                <Link href="/owner/dashboard" className="block px-5 py-3 uppercase tracking-[0.35em] text-sm border-t border-black/10">Dashboard</Link>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/owner/dashboard">
                  <button className="block w-full text-left px-5 py-3 uppercase tracking-[0.35em] text-sm border-t border-black/10">Staff Portal</button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
