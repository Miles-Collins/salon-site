"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Hours" },
  { href: "/contact", label: "Contact" },
];

import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60); // adjust threshold as needed
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-black/90 border-b border-black/30 shadow-lg backdrop-blur" : "bg-gradient-to-b from-black/60 to-transparent border-none"}`}
    >
  <div className="w-full flex h-16 items-center px-4 sm:px-5 md:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-white drop-shadow">Hair</span> <span className="text-brand-accent drop-shadow">by Porscha</span>
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
          <div className="flex items-center gap-4">
            <Link href="/book" className="group text-white text-sm font-semibold uppercase tracking-wide link-underline">Book Now</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
