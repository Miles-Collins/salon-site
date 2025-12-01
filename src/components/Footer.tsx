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
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <a href="tel:9136807987" className="hover:text-brand-accent whitespace-nowrap">(913) 680-7987</a>
              <span className="text-white/30">|</span>
              <a href="mailto:PorschaCradic@gmail.com" className="hover:text-brand-accent whitespace-nowrap">PorschaCradic@gmail.com</a>
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
          
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4">Reviews</div>
          <div className="mb-8">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Color+Rebel+by+Porscha+Leavenworth+KS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-brand-accent transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Reviews
            </a>
          </div>
          
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4">Hours</div>
          <div className="grid grid-cols-2 gap-x-4 text-white/80 text-sm">
            <div>Mon</div><div>Closed</div>
            <div>Tue</div><div>12 PM – 8 PM</div>
            <div>Wed</div><div>Closed</div>
            <div>Thu</div><div>11 AM – 8 PM</div>
            <div>Fri</div><div>10 AM – 5 PM</div>
            <div>Sat</div><div>9 AM – 4 PM<span className="text-xs block text-white/60">(1st Sat only)</span></div>
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
