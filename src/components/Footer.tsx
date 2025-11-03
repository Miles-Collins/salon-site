import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-14 pb-6">
      {/* Top contact bar area inspired by reference */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 md:pb-14">
        {/* Quicklinks (left) */}
        <div className="md:pr-8">
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-6">Quicklinks</div>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-brand-accent transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-brand-accent transition">About</Link></li>
            <li><Link href="/services" className="hover:text-brand-accent transition">Services</Link></li>
            <li><Link href="/gallery" className="hover:text-brand-accent transition">Gallery</Link></li>
            <li><Link href="/book" className="hover:text-brand-accent transition">Book</Link></li>
            <li><Link href="/contact" className="hover:text-brand-accent transition">Contact</Link></li>
            <li><Link href="/policies" className="hover:text-brand-accent transition">Policies</Link></li>
          </ul>
        </div>

        {/* Brand + socials + address (center) */}
        <div className="relative md:px-10 md:border-x md:border-white/10">
          <div className="text-5xl md:text-6xl font-light tracking-wider text-center mb-6">COLOR REBEL</div>
          <div className="flex items-center justify-center gap-5 mb-6">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-brand-accent transition">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="7" strokeWidth="2"/><rect x="17" y="7" width="2" height="2" rx="1"/><rect x="2" y="2" width="20" height="20" rx="6" strokeWidth="2"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-brand-accent transition">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5v-7h-2v-3h2V9a3 3 0 0 1 3-3h2v3h-2v3h2v7h2a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z" strokeWidth="2"/></svg>
            </a>
            <a href="mailto:PorschaCradic@gmail.com" aria-label="Email" className="hover:text-brand-accent transition">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="10" rx="2" strokeWidth="2"/><path d="M3 7l9 6 9-6" strokeWidth="2"/></svg>
            </a>
          </div>
          <div className="space-y-2 text-center text-sm text-white/80">
            <a
              href="https://www.google.com/maps/search/?api=1&query=301+S+5TH+ST+LEAVENWORTH+KS+66048"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-accent"
            >
              301 S 5TH ST., LEAVENWORTH, KS 66048
            </a>
            <div className="space-x-4">
              <a href="tel:9136807987" className="hover:text-brand-accent">(913) 680-7987</a>
              <span className="text-white/30">|</span>
              <a href="mailto:PorschaCradic@gmail.com" className="hover:text-brand-accent">PorschaCradic@gmail.com</a>
            </div>
            <div>
              <Link href="/book" className="underline font-semibold hover:text-brand-accent">BOOK ONLINE</Link>
            </div>
          </div>
        </div>

        {/* Location + Hours (right) */}
        <div className="md:pl-8">
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-6">Location</div>
          <ul className="space-y-3 text-sm mb-8">
            <li>Leavenworth, KS</li>
          </ul>
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4">Hours</div>
          <div className="grid grid-cols-2 gap-x-4 text-white/80 text-sm">
            <div>Mon</div><div>Closed</div>
            <div>Tue</div><div>12 PM – 8 PM</div>
            <div>Wed</div><div>Closed</div>
            <div>Thu</div><div>11 AM – 8 PM</div>
            <div>Fri</div><div>10 AM – 5 PM</div>
            <div>Sat</div><div>9 AM – 4 PM</div>
            <div>Sun</div><div>Closed</div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10 pt-3 pb-1 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Color Rebel by Porscha &nbsp;|&nbsp; <a href="/terms" className="underline">Terms and Conditions</a> &nbsp;|&nbsp; <a href="/privacy" className="underline">Privacy Policy</a>
      </div>
    </footer>
  );
}
