export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-8">
        {/* Brand/About */}
        <div>
          <div className="text-3xl font-light tracking-wide mb-2">Hair by Porscha</div>
          <p className="text-white/80 mb-4 text-sm">Effortless beauty, expert care, and a relaxing studio experience. Book online or reach out with questions!</p>
          <div className="flex gap-4 mb-4">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="hover:text-brand-accent transition"><circle cx="12" cy="12" r="7" strokeWidth="2"/><rect x="17" y="7" width="2" height="2" rx="1"/><rect x="2" y="2" width="20" height="20" rx="6" strokeWidth="2"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="hover:text-brand-accent transition"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5v-7h-2v-3h2V9a3 3 0 0 1 3-3h2v3h-2v3h2v7h2a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z" strokeWidth="2"/></svg>
            </a>
            <a href="mailto:hello@porscha.salon" aria-label="Email">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="hover:text-brand-accent transition"><rect x="3" y="7" width="18" height="10" rx="2" strokeWidth="2"/><path d="M3 7l9 6 9-6" strokeWidth="2"/></svg>
            </a>
          </div>
          <a href="/book" className="inline-block mt-2 underline font-semibold text-white hover:text-brand-accent">BOOK ONLINE</a>
        </div>
        {/* Contact */}
        <div>
          <div className="font-bold text-lg mb-2">CONTACT</div>
          <div className="text-white/80 text-sm mb-2">123 Main St, Your City, CA 90210</div>
          <a href="tel:5551234567" className="block text-white/80 text-sm mb-2">(555) 123-4567</a>
          <a href="mailto:hello@porscha.salon" className="block text-white/80 text-sm mb-2">Email Us</a>
        </div>
        {/* Info/Hours */}
        <div>
          <div className="font-bold text-lg mb-2">INFO</div>
          <div className="grid grid-cols-2 gap-x-4 text-white/80 text-sm">
            <div>Monday</div><div>Closed</div>
            <div>Tuesday</div><div>10AM - 6PM</div>
            <div>Wednesday</div><div>10AM - 6PM</div>
            <div>Thursday</div><div>10AM - 6PM</div>
            <div>Friday</div><div>10AM - 6PM</div>
            <div>Saturday</div><div>10AM - 6PM</div>
            <div>Sunday</div><div>Closed</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-3 pb-1 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Hair by Porscha &nbsp;|&nbsp; <a href="/terms" className="underline">Terms and Conditions</a> &nbsp;|&nbsp; <a href="/privacy" className="underline">Privacy Policy</a>
      </div>
    </footer>
  );
}
