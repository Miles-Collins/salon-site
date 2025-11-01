"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Hours" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-brand">Hair</span> <span className="text-brand-accent">by Porscha</span>
        </Link>
        <nav className="hidden gap-2 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${active ? "bg-black/5" : "hover:bg-black/5"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/book" className="btn-accent">Book Now</Link>
      </div>
    </header>
  );
}
